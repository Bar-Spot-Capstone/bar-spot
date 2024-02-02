import express from "express";
import { userRegister, userLogin } from "../controllers/User";

const router: express.Router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin)

export default router;