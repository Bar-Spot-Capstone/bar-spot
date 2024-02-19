import express from "express";
import { createUserGroup, inviteUser, getMembers, deleteParty, removeMember } from "../controllers/UserGroup";

const router: express.Router = express.Router();

router.post('/create', createUserGroup);
router.post('/invite', inviteUser);
router.get('/members/:groupId', getMembers);
router.delete('/party/:id', deleteParty);
router.delete('/remove/:userId/:id', removeMember);


export default router;