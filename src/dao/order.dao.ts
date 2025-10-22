import sequelize from '../config/db.js';
import Order from '../models/order.model.js';
import OrderItem from '../models/orderItem.model.js';
import Product from '../models/product.model.js';
import Client from '../models/client.model.js';

export interface OrderItemInput {
    productId: number;
    quantity: number;
}

export interface CreateOrderData {
    clientId: number;
    items: OrderItemInput[];
}

export interface OrderFilter {
    clientId?: number;
    productId?: number;
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export class OrderDAO {
    async createOrder(data: CreateOrderData) {
        return await sequelize.transaction(async (t) => {
            // Validate client exists
            const client = await Client.findByPk(data.clientId, { transaction: t });
            if (!client) {
                throw new Error('Client not found');
            }

            if (!data.items || data.items.length === 0) {
                throw new Error('Order items are required');
            }

            // Load products with locking for stock validation
            const productIds = [...new Set(data.items.map(i => i.productId))];
            const products = await Product.findAll({
                where: { id: productIds },
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (products.length !== productIds.length) {
                throw new Error('One or more products not found');
            }

            // Map for quick lookup
            const productMap = new Map(products.map(p => [p.id, p]));

            // Validate stock
            for (const item of data.items) {
                const product = productMap.get(item.productId)!;
                if (item.quantity <= 0) {
                    throw new Error(`Invalid quantity for product ${item.productId}`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.code}`);
                }
            }

            // Create order
            const order = await Order.create({ clientId: data.clientId, status: 'pending', total: 0 }, { transaction: t });

            // Create order items and update stock
            let total = 0;
            for (const item of data.items) {
                const product = productMap.get(item.productId)!;
                const unitPrice = Number(product.price);
                total += unitPrice * item.quantity;

                await OrderItem.create({
                    orderId: order.id,
                    productId: product.id,
                    quantity: item.quantity,
                    unitPrice
                }, { transaction: t });

                // Reduce stock
                const newStock = product.stock - item.quantity;
                await product.update({ stock: newStock }, { transaction: t });
            }

            // Update order total
            await order.update({ total }, { transaction: t });

            return order;
        });
    }

    async findById(id: number) {
        return await Order.findByPk(id, {
            include: [
                { model: Client, as: 'client' },
                {
                    model: Product,
                    as: 'products',
                    through: { attributes: ['quantity', 'unitPrice'] }
                }
            ]
        });
    }

    async findAll(filter: OrderFilter = {}, pagination: PaginationOptions = {}) {
        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        const where: any = {};
        if (filter.clientId) where.clientId = filter.clientId;

        const include: any[] = [
            { model: Client, as: 'client' },
        ];

        if (filter.productId) {
            include.push({
                model: Product,
                as: 'products',
                where: { id: filter.productId },
                through: { attributes: ['quantity', 'unitPrice'] }
            });
        } else {
            include.push({
                model: Product,
                as: 'products',
                through: { attributes: ['quantity', 'unitPrice'] }
            });
        }

        const { rows, count } = await Order.findAndCountAll({
            where,
            include,
            distinct: true,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            orders: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    }
}
