import express from "express";
import { setLocationShare, setTimerSetting, getPreferences } from "../controllers/Preferences"

const router: express.Router = express.Router();

router.post('/Location', setLocationShare);
router.post('/Timer', setTimerSetting)
router.get('/get/:userId', getPreferences);

export default router;