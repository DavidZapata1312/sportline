import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface DeliveryItemAttributes {
    id: number;
    deliveryId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface DeliveryItemCreationAttributes extends Optional<DeliveryItemAttributes, 'id' | 'unitPrice' | 'subtotal'> {}

class DeliveryItem extends Model<DeliveryItemAttributes, DeliveryItemCreationAttributes> implements DeliveryItemAttributes {
    public id!: number;
    public deliveryId!: number;
    public productId!: number;
    public quantity!: number;
    public unitPrice!: number;
    public subtotal!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

DeliveryItem.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        deliveryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
        tableName: 'delivery_items',
        sequelize,
        timestamps: true,
    }
);

export default DeliveryItem;
