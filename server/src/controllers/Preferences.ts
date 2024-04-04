import Preferences from "../models/Preferences";
import User from "../models/Users";
import { Request, Response } from "express";

const setLocationShare = async (req: Request, res: Response): Promise<Response> => {
    const { userId, shareLocation }: { userId: string, shareLocation: boolean } = req.body;

    // Check which params are missing
    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !shareLocation && shareLocation !== false ? 'shareLocation' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to change location share, missing field: ${handleEmpty}` });
    };

    // Check if shareLocation is not a boolean
    if (typeof shareLocation !== 'boolean') {
        res.status(400);
        return res.json({ error: `Failed to change location share, 'shareLocation' must be a boolean` });
    };

    try {
        // check if user exists
        const user: any = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            res.status(400);
            return res.json({error: "User not found" });
        }
        
        // Check if shareLocation is already set to the desired value
        const existingPreferences = await Preferences.findOne({ where: { userId: userId } });

        if (existingPreferences && existingPreferences.shareLocation === shareLocation) {
            res.status(200);
            return res.json({ success: `Share Location is already set to ${shareLocation}` });
        }

        // Update shareLocation if preferences exist
        if (existingPreferences) {
            await Preferences.update({ shareLocation: shareLocation }, { where: { userId: userId } });
            res.status(200);
            return res.json({ success: `Share Location changed to ${shareLocation}` });
        } else {
            res.status(400);
            return res.json({ error: "Preferences entry not found for the user" });
        }
    } catch (error: any) {
        res.status(500);
        return res.json({ error: `Server failed with error ${error}` })
    }
};

const setVisitedShare = async (req: Request, res: Response): Promise<Response> => {
    const { userId, shareVisitedBars }: { userId: string, shareVisitedBars: boolean } = req.body;

    // Check which params are missing
    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !shareVisitedBars && shareVisitedBars !== false ? 'shareVisitedBars' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to change visited share, missing field: ${handleEmpty}` });
    };

    // Check if shareVisitedBars is not a boolean
    if (typeof shareVisitedBars !== 'boolean') {
        res.status(400);
        return res.json({ error: `Failed to change visited share, 'shareVisitedBars' must be a boolean` });
    };

    try {
        // check if user exists
        const user: any = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            res.status(400);
            return res.json({error: "User not found" });
        }
        
        // Check if shareVisitedBars is already set to the desired value
        const existingPreferences = await Preferences.findOne({ where: { userId: userId } });

        if (existingPreferences && existingPreferences.shareVisitedBars === shareVisitedBars) {
            res.status(200);
            return res.json({ success: `Share Visited Bars is already set to ${shareVisitedBars}` });
        }

        // Update shareLocation if preferences exist
        if (existingPreferences) {
            await Preferences.update({ shareVisitedBars: shareVisitedBars }, { where: { userId: userId } });
            res.status(200);
            return res.json({ success: `Share Visited Bars changed to ${shareVisitedBars}` });
        } else {
            res.status(400);
            return res.json({ error: "Preferences entry not found for the user" });
        }
    } catch (error: any) {
        res.status(500);
        return res.json({ error: `Server failed with error ${error}` })
    }
};

const setTimerSetting = async (req: Request, res: Response): Promise<Response> => {
    const { userId, timerSetting }: { userId: string, timerSetting: number } = req.body;

    // Check which params are missing
    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !timerSetting && timerSetting !== 0 ? 'timerSetting' : '';


    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to change timer setting, missing field: ${handleEmpty}` });
    }

    // Check if timerSetting is not a number or is not within the valid range
    if (isNaN(timerSetting) || timerSetting < 1 || timerSetting >= Number.MAX_SAFE_INTEGER) {
        res.status(400);
        return res.json({ error: 'Failed to change timer setting, timerSetting must be a number between 1 and Max_Safe_Int' });
    }

    try {
        // Check if user exists
        const user: any = await User.findOne({
            where: { id: userId }
        });

        if (!user) {
            res.status(400);
            return res.json({ error: "User not found" });
        }
        
        // Check if timerSetting is already set to the desired value
        const existingPreferences = await Preferences.findOne({ where: { userId: userId } });

        if (existingPreferences && existingPreferences.timerSetting === timerSetting) {
            res.status(200);
            return res.json({ success: `Timer setting is already set to ${timerSetting} minutes` });
        }

        // Update timerSetting if preferences exist
        if (existingPreferences) {
            await Preferences.update({ timerSetting: timerSetting }, { where: { userId: userId } });
            res.status(200);
            return res.json({ success: `Timer setting changed to ${timerSetting} minutes` });
        } else {
            res.status(400);
            return res.json({ error: "Preferences entry not found for the user" });
        }
    } catch (error: any) {
        res.status(500);
        return res.json({ error: `Server failed with error ${error}` });
    }
};

const getPreferences = async (req: Request, res: Response) => {
    const {userId}: any = req.params;

    // Check for null parameter
    if (!userId) {
        res.status(400);
        return res.json({ error: "No userId provided" });
    };

    try {
        // Check if user exists
        const user: any = await User.findOne({
            where: { id: userId }
        });

        if (!user) {
            res.status(400);
            return res.json({ error: "User not found" });
        }

        // Find preferences for the user
        const preferences = await Preferences.findOne({ 
            where: { userId: userId },
            attributes: ['id', 'userId', 'timerSetting', 'shareLocation', 'shareVisitedBars']
        });

        if (!preferences) {
            res.status(400);
            return res.json({ error: "Preferences entry not found for the user" });
        }
        
        res.status(200);
        return res.json({ preferences: preferences });
    } catch (error: any) {
        res.status(500);
        return res.json({ error: `Server failed with error: ${error.message}` });
    }
};

export {
    setLocationShare,
    setVisitedShare,
    setTimerSetting,
    getPreferences
};