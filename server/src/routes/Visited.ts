import express from "express";
import { newVisited, getAllVisited } from "../controllers/Visited";
import { verifyToken } from "../controllers/User";

const router: express.Router = express.Router();

router.post('/new', verifyToken, newVisited);
router.get('/view', getAllVisited);

export default router;