import express from "express";
import { setLocationShare, setTimerSetting, getPreferences, setVisitedShare } from "../controllers/Preferences"

const router: express.Router = express.Router();

router.post('/location', setLocationShare);
router.post('/timer', setTimerSetting);
router.post('/visited', setVisitedShare);
router.get('/get/:userId', getPreferences);

export default router;