import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'staff';
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public role!: 'admin' | 'staff';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255), allowNull: false },
        role: { type: DataTypes.ENUM('admin', 'staff'), allowNull: false, defaultValue: 'staff' },
    },
    {
        tableName: 'users',
        sequelize,
        timestamps: true,
    }
);

export default User;