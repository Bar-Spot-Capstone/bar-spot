import { Sequelize } from "sequelize-typescript";
import 'dotenv/config'

const sequelize: any = new Sequelize({
    database: process.env.DB_NAME,
    dialect: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: ["./models"]
});

export default sequelize;