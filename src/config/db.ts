import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "sportslinedb", // bd name
    "postgres",     // user
    "perla",        // password
    {
        host: "localhost",
        port: 5432,
        dialect: "postgres",
        logging: false,
    }
);

export default sequelize;