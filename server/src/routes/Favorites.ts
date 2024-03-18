import express from "express";
import { addFavorite, getFavorites } from "../controllers/Favorites"

const router: express.Router = express.Router();

router.post('/add', addFavorite);
router.get('/get/:userId', getFavorites);

export default router;