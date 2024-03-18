import Preferences from "../models/Preferences";
import User from "../models/Users";
import { Request, Response } from "express";

const setLocationShare = async (req: Request, res: Response): Promise<Response> => {
    const { userId, shareLocation }: { userId: string, shareLocation: boolean } = req.body;

    // Check if shareLocation is not a boolean
    if (typeof shareLocation !== 'boolean') {
        res.status(400);
        return res.json({ error: `Failed to change location share, 'shareLocation' must be a boolean` });
    };

    // Check which params are missing
    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !shareLocation ? 'timerSetting' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to change location share, missing field: ${handleEmpty}` });
    };

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

    try {
        // Check if shareLocation is already set to the desired value
        const existingPreferences = await Preferences.findOne({ where: { userId: userId } });

        if (existingPreferences && existingPreferences.shareLocation === shareLocation) {
            res.status(200);
            return res.json({ success: `Share Location is already set to ${shareLocation}`, userId: userId, shareLocation: shareLocation });
        }

        // Update shareLocation if preferences exist
        if (existingPreferences) {
            await Preferences.update({ shareLocation: shareLocation }, { where: { userId: userId } });
            res.status(200);
            return res.json({ success: `Share Location changed to ${shareLocation}`, userId: userId, shareLocation: shareLocation });
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

    // Check if shareVisitedBars is not a boolean
    if (typeof shareVisitedBars !== 'boolean') {
        res.status(400);
        return res.json({ error: `Failed to change visited share, 'shareVisitedBars' must be a boolean` });
    };

    // Check which params are missing
    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !shareVisitedBars ? 'shareVisitedBars' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to change visited share, missing field: ${handleEmpty}` });
    };

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

    try {
        // Check if shareVisitedBars is already set to the desired value
        const existingPreferences = await Preferences.findOne({ where: { userId: userId } });

        if (existingPreferences && existingPreferences.shareLocation === shareVisitedBars) {
            res.status(200);
            return res.json({ success: `Share Visited Bars is already set to ${shareVisitedBars}`, userId: userId, shareVisitedBars: shareVisitedBars });
        }

        // Update shareLocation if preferences exist
        if (existingPreferences) {
            await Preferences.update({ shareVisitedBars: shareVisitedBars }, { where: { userId: userId } });
            res.status(200);
            return res.json({ success: `Share Visited Bars changed to ${shareVisitedBars}`, userId: userId, shareVisitedBars: shareVisitedBars });
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

    // Check if timerSetting is not a number or is not within the valid range
    if (typeof timerSetting !== 'number' || timerSetting < 1 || timerSetting > 180) {
        res.status(400);
        return res.json({ error: 'Failed to change timer setting, timerSetting must be a number between 1 and 180' });
    }

    // Check which params are missing
    const handleEmpty: string = !userId ? 'userId' : !timerSetting ? 'timerSetting' : '';

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to change timer setting, missing field: ${handleEmpty}` });
    }

    // Check if user exists
    const user: any = await User.findOne({
        where: { id: userId }
    });

    if (!user) {
        res.status(400);
        return res.json({ error: "User not found" });
    }

    try {
        // Check if timerSetting is already set to the desired value
        const existingPreferences = await Preferences.findOne({ where: { userId: userId } });

        if (existingPreferences && existingPreferences.timerSetting === timerSetting) {
            res.status(200);
            return res.json({ success: `Timer setting is already set to ${timerSetting} minutes`, userId: userId, timerSetting: timerSetting });
        }

        // Update timerSetting if preferences exist
        if (existingPreferences) {
            await Preferences.update({ timerSetting: timerSetting }, { where: { userId: userId } });
            res.status(200);
            return res.json({ success: `Timer setting changed to ${timerSetting} minutes`, userId: userId, timerSetting: timerSetting });
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

    try {
        // Find preferences for the user
        const preferences = await Preferences.findOne({ where: { userId: userId } });

        if (!preferences) {
            res.status(400);
            return res.json({ error: "Preferences not found for the user" });
        }

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