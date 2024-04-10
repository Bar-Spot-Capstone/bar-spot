import express from "express";
import { createUserGroup, inviteMember, getMembers, deleteParty, leaveParty } from "../controllers/UserGroup";

const router: express.Router = express.Router();

router.post('/create', createUserGroup);
router.post('/invite', inviteMember);
router.get('/members/:groupId', getMembers);
router.delete('/delete/:userId/:groupId', deleteParty);
router.delete('/leave/:userId/:groupId', leaveParty);

export default router;