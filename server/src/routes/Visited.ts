import express from "express";
import { newVisited } from "../controllers/Visited";

const router: express.Router = express.Router();

router.post('/new', newVisited);

export default router;