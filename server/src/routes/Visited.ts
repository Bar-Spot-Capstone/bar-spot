import express from "express";
import { newVisited, getAllVisited} from "../controllers/Visited";

const router: express.Router = express.Router();

router.post('/new', newVisited);
router.get('/view', getAllVisited);


export default router;