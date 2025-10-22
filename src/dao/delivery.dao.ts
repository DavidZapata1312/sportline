import sequelize from '../config/db.js';
import Delivery from '../models/delivery.model.js';
import DeliveryItem from '../models/deliveryItem.model.js';
import Product from '../models/product.model.js';
import Client from '../models/client.model.js';
import { Transaction } from 'sequelize';

export interface DeliveryItemInput {
    productId: number;
    quantity: number;
}

export interface CreateDeliveryData {
    clientId: number;
    items: DeliveryItemInput[];
    notes?: string;
}

export class DeliveryDAO {
    async createDelivery(data: CreateDeliveryData) {
        return await sequelize.transaction(async (t: Transaction) => {
            // Validate client exists
            const client = await Client.findByPk(data.clientId, { transaction: t });
            if (!client) throw new Error('Client not found');

            if (!data.items || data.items.length === 0) {
                throw new Error('At least one item is required');
            }

            // Validate stock and gather products
            const productsMap: Record<number, Product> = {} as any;
            for (const item of data.items) {
                const product = await Product.findByPk(item.productId, { transaction: t, lock: t.LOCK.UPDATE });
                if (!product) throw new Error(`Product ${item.productId} not found`);
                if (item.quantity <= 0) throw new Error(`Invalid quantity for product ${item.productId}`);
                if (product.stock < item.quantity) throw new Error(`Insufficient stock for product ${product.name}`);
                productsMap[item.productId] = product;
            }

            // Create delivery
            const delivery = await Delivery.create({ clientId: data.clientId, notes: data.notes ?? undefined, totalAmount: 0 }, { transaction: t });

            let total = 0;
            // Create items and adjust stock
            for (const item of data.items) {
                const product = productsMap[item.productId];
                const unitPrice = Number(product.price);
                const subtotal = unitPrice * item.quantity;
                total += subtotal;

                await DeliveryItem.create({
                    deliveryId: delivery.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: unitPrice,
                    subtotal: subtotal,
                }, { transaction: t });

                // decrement stock
                await product.update({ stock: product.stock - item.quantity }, { transaction: t });
            }

            await delivery.update({ totalAmount: total }, { transaction: t });

            // Reload with associations
            const created = await Delivery.findByPk(delivery.id, {
                include: [
                    { model: Client, as: 'client' },
                    { model: DeliveryItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'code', 'name'] }] }
                ],
                transaction: t
            });

            return created;
        });
    }

    async getClientHistory(clientId: number, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const { rows, count } = await Delivery.findAndCountAll({
            where: { clientId },
            include: [
                { model: DeliveryItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'code', 'name'] }] }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        return {
            deliveries: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    }
}
