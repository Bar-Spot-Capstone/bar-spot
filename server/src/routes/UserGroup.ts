import express from "express";
import { createUserGroup, inviteMember, getMembers, deleteParty, leaveParty, getGroupInformation } from "../controllers/UserGroup";
import { verifyToken } from "../controllers/User";

const router: express.Router = express.Router();

router.post('/create', verifyToken, createUserGroup);
router.post('/invite', verifyToken, inviteMember);
router.get('/members/:groupId', verifyToken, getMembers);
router.get('/group/info/:userId', verifyToken, getGroupInformation);
router.delete('/delete/:userId/:groupId', verifyToken, deleteParty);
router.delete('/leave/:userId/:groupId', verifyToken, leaveParty);

export default router;