import express from "express";
import { userRegister } from "../controllers/User";

const router: express.Router = express.Router();

router.post('/register', userRegister);

export default router;