import express from "express";
import { setLocationShare, setTimerSetting, getPreferences, setVisitedShare } from "../controllers/Preferences"

const router: express.Router = express.Router();

router.post('/Location', setLocationShare);
router.post('/Timer', setTimerSetting);
router.post('/Visited', setVisitedShare);
router.get('/get/:userId', getPreferences);

export default router;