import express from "express";
import { userRegister, userLogin, deleteUser } from "../controllers/User";

const router: express.Router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.delete('/delete/:id', deleteUser);

export default router;