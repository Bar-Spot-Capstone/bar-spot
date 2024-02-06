import express from "express";
import { addFavorite } from "../controllers/Favorite"

const router: express.Router = express.Router();

router.post('/addFavorite', addFavorite);

export default router;