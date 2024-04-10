import express from "express";
import { createUserGroup, inviteMember, getMembers, deleteParty, leaveParty, getGroupInformation } from "../controllers/UserGroup";

const router: express.Router = express.Router();

router.post('/create', createUserGroup);
router.post('/invite', inviteMember);
router.get('/members/:groupId', getMembers);
router.get('/group/info/:userId', getGroupInformation);
router.delete('/delete/:userId/:groupId', deleteParty);
router.delete('/leave/:userId/:groupId', leaveParty);

export default router;