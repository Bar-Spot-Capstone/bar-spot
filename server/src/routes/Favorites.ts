import express from "express";
import { addFavorite, deleteFavorite, getFavorites, clearFavorites} from "../controllers/Favorites"

const router: express.Router = express.Router();

router.post('/add', addFavorite);
router.get('/get/:userId', getFavorites);
router.delete('/delete/:userId/:id', deleteFavorite);
router.delete('/clear/:userId', clearFavorites)

export default router;