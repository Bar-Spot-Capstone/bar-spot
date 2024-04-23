import express from "express";
import { getAllInvites, respondToInvite } from "../controllers/Invitations";
import { verifyToken } from "../controllers/User";

const router: express.Router = express.Router();

router.get('/:userId', verifyToken, getAllInvites);
router.post('/respond', verifyToken, respondToInvite);

export default router;