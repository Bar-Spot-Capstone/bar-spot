import express from "express";
import cors from "cors";
import sequelize from "./config/connection";
import userRouter from "./routes/User";
import groupRouter from "./routes/Group";
import favoriteRouter from "./routes/Favorites";
import userGroupRouter from "./routes/UserGroup";
import visitedRouter from "./routes/Visited";
import yelpRouter from "./routes/YelpFetch"

import "dotenv/config";

const app: express.Application = express();
const PORT: number = Number(process.env.PORT) | 3001;
const API_URL: string[] = ["https://bar-spot-capstone.github.io","http://localhost:4173/", "http://localhost:5173/"];
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  origin: API_URL,
};

//Middleware
app.use(express.json());
app.use(cors(options));

//Routers
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("/visit", visitedRouter);
app.use("/favorite", favoriteRouter);
app.use("/party", userGroupRouter);
app.use("/yelp", yelpRouter);

sequelize
  .sync()
  .then((): void => {
    app.listen(PORT, (): void => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error): void => {
    console.error("Error synchronizing database:", error);
  });
