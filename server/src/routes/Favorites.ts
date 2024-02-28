import express from "express";
import { addFavorite, deleteFavorite, getFavorites, clearFavorites} from "../controllers/Favorites"

const router: express.Router = express.Router();

router.post('/addFavorite', addFavorite);
router.get('/getFavorite/:userId', getFavorites);
router.delete('/delete/:userId/:id', deleteFavorite);
router.delete('/clear/:userId', clearFavorites)

export default router;