import express from "express";
import { addFavorite, deleteFavorite, getFavorites, clearFavorites } from "../controllers/Favorites"
import { verifyToken } from "../controllers/User";

const router: express.Router = express.Router();

router.post('/add', verifyToken, addFavorite);
router.get('/get/:userId', verifyToken, getFavorites);
router.delete('/delete/:userId/:id', verifyToken, deleteFavorite);
router.delete('/clear/:userId', verifyToken, clearFavorites)

export default router;