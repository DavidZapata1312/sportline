import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface OrderItemAttributes {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;
    public unitPrice!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderItem.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
        tableName: 'order_items',
        sequelize,
        timestamps: true,
        indexes: [
            { fields: ['orderId'] },
            { fields: ['productId'] },
            { unique: true, fields: ['orderId', 'productId'] }
        ]
    }
);

export default OrderItem;
