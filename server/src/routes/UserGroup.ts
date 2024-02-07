import express from "express";
import { createUserGroup, inviteUser } from "../controllers/UserGroup";

const router: express.Router = express.Router();

router.post('/create', createUserGroup);
router.post('/invite', inviteUser);

export default router;