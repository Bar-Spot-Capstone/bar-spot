import express from "express";
import { addGroup } from "../controllers/Group"

const router: express.Router = express.Router();

router.post('/add', addGroup);

export default router;