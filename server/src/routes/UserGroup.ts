import express from "express";
import { createUserGroup, inviteUser, getMembers } from "../controllers/UserGroup";

const router: express.Router = express.Router();

router.post('/create', createUserGroup);
router.post('/invite', inviteUser);
router.get('/members/:groupId', getMembers)

export default router;