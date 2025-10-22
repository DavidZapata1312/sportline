import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // charge env

const sequelize = new Sequelize(
    process.env.DB_NAME || 'sportsline',
    process.env.DB_USER || 'david',
    process.env.DB_PASSWORD || 'perla',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default sequelize;
