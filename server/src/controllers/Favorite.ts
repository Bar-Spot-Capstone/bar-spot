import Favorite from "../models/Favorite";
import { Request, Response } from "express";

const addFavorite = async (req: Request, res: Response): Promise<Response> => {
    const { userId, barName, address, note }: { userId: string, barName: string, address: string, note: string } = req.body;

    if (!userId || !barName) {
        res.status(400);
        return res.json({ error: "Failed to register missing fields" });
    };

    try {
        const existingFavorite = await Favorite.findOne({
            where: {
                userId: userId,
                barName: barName,
            }
        });

        if (existingFavorite) {
            res.status(400);
            return res.json({ error: "Bar already in favorites" });
        }

        await Favorite.create({
            userId: userId,
            barName: barName,
            address: address,
            note: note,
        });
        
        res.status(200);
        return res.json({ success: "Bar added to favorites" })
    } catch (error: any) {
        res.status(500);
        return res.json({ error: "Server failed with error ${error}" })
    }
};

export {
    addFavorite
};