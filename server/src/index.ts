import express from "express";
import sequelize from "./config/connection";
import userRouter from "./routes/User";
import groupRouter from "./routes/Group"
import visitedRouter from "./routes/Visited"

import 'dotenv/config';

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) | 3001;

//Middleware
app.use(express.json());

//Routers
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/visit', visitedRouter);

sequelize.sync().then((): void => {
    app.listen(PORT, (): void => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error: Error): void => {
        console.error('Error synchronizing database:', error);
    });
