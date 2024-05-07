import express from "express";
import { getPubs } from "../controllers/Yelp";

const router: express.Router = express.Router();

router.get('/pubs/:lat/:lon', getPubs);

export default router;