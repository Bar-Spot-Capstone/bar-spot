import express from "express"
import sequelize from "./config/connection";
import 'dotenv/config'

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) | 3001;

sequelize.sync().then((): void => {
    app.listen(PORT, (): void => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error: Error): void => {
        console.error('Error synchronizing database:', error);
    });
