import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import Client from './client.model.js';
import Product from './product.model.js';
import OrderItem from './orderItem.model.js';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

interface OrderAttributes {
    id: number;
    clientId: number;
    status: OrderStatus;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status' | 'total'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public clientId!: number;
    public status!: OrderStatus;
    public total!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'paid', 'cancelled'), allowNull: false, defaultValue: 'pending' },
        total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    },
    {
        tableName: 'orders',
        sequelize,
        timestamps: true,
    }
);

// Associations
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });

Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId', otherKey: 'productId', as: 'products' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId', otherKey: 'orderId', as: 'orders' });

export default Order;
