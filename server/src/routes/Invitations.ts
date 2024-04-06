import express from "express";
import { getAllInvites, respondToInvite } from "../controllers/Invitations";

const router: express.Router = express.Router();

router.get('/:userId', getAllInvites);
router.post('/respond', respondToInvite);

export default router;