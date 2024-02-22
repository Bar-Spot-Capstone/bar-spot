import express from "express";
import { addFavorite, getFavorites } from "../controllers/Favorites"

const router: express.Router = express.Router();

router.post('/addFavorite', addFavorite);
router.get('/getFavorite/:userId', getFavorites);

export default router;