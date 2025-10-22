// models/Product.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../config/db.js";

interface ProductAttributes {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    brand?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// id creation
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'brand'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public description?: string;
    public price!: number;
    public category!: string;
    public stock!: number;
    public brand?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// model definition
Product.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        brand: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    },
    {
        tableName: 'products',
        sequelize, // conexión
        timestamps: true, // createdAt y updatedAt
    }
);

export default Product;
