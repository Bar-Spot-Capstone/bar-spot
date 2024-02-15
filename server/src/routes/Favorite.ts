import express from "express";
import { addFavorite, getFavorite } from "../controllers/Favorite"

const router: express.Router = express.Router();

router.post('/addFavorite', addFavorite);
router.get('/getFavorite/:userId', getFavorite);

export default router;