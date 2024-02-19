import Favorites from "../models/Favorites";
import User from "../models/Users"
import { Request, Response } from "express";

const addFavorite = async (req: Request, res: Response): Promise<Response> => {
    const { userId, barName, address, note }: { userId: string, barName: string, address: string, note: string } = req.body;
    
    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !barName ? 'barName' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to create favorite, missing field: ${handleEmpty}` });
    };

    try {
        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            res.status(400);
            return res.json({ error: "No such userId exists" });
        }

        const existingFavorite = await Favorites.findOne({
            where: {
                userId: userId,
                barName: barName,
            }
        });

        if (existingFavorite) {
            res.status(400);
            return res.json({ error: "Bar already in favorites" });
        }

        await Favorites.create({
            userId: userId,
            barName: barName,
            address: address,
            note: note,
        });
        
        res.status(200);
        return res.json({ success: "Bar added to favorites", userId: userId, barName: barName, address: address, note: note })
    } catch (error: any) {
        res.status(500);
        return res.json({ error: `Server failed with error ${error}` })
    }
};

const getFavorites = async (req: Request, res: Response) => {
    const {userId}: any = req.params;
    res.status(200);
    return res.json({ success: `${userId}` });
};

export {
    addFavorite,
    getFavorites
};