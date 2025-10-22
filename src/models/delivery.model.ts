import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface DeliveryAttributes {
    id: number;
    clientId: number;
    totalAmount: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface DeliveryCreationAttributes extends Optional<DeliveryAttributes, 'id' | 'totalAmount' | 'notes'> {}

class Delivery extends Model<DeliveryAttributes, DeliveryCreationAttributes> implements DeliveryAttributes {
    public id!: number;
    public clientId!: number;
    public totalAmount!: number;
    public notes?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Delivery.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
        notes: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
        tableName: 'deliveries',
        sequelize,
        timestamps: true,
    }
);

export default Delivery;
