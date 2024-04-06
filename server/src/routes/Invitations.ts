import express from "express";
import { getAllInvites } from "../controllers/Invitations";

const router: express.Router = express.Router();

router.get('/:userId', getAllInvites);

export default router;