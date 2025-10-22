import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface ClientAttributes {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'phone' | 'address'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public phone?: string;
    public address?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Client.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        phone: { type: DataTypes.STRING(20), allowNull: true },
        address: { type: DataTypes.STRING(200), allowNull: true },
    },
    {
        tableName: 'clients',
        sequelize,
        timestamps: true,
    }
);

export default Client;