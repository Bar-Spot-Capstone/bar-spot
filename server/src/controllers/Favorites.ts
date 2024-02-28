import Favorites from "../models/Favorites";
import User from "../models/Users";
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

    if (!userId) {
        res.status(400);
        return res.json({ error: "No userId provided" });
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

        const faves: any = await Favorites.findAll({
            where: {
                userId: userId
            },
            // Attributes wanted
            attributes: ['id', 'userId', 'barName', 'address', 'note']
        });
        
        const bars = [];

        for (let i = 0; i < faves.length; i++) {
            const favorite = faves[i];
            bars.push({
                barName: favorite.barName,
                address: favorite.address,
                note: favorite.note
            });
        };

        res.status(200);
        return res.json({ favorites: bars });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };

};

const deleteFavorite = async (req: Request, res: Response) => {
    const userId: string = req.params.userId; // Takes both a userId and favorite id to decide which favorite object to destroy 
    const id: string = req.params.id;

    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !id ? 'id' : '' //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Unable to read: ${handleEmpty}` })
    };

    try {
        const favoriteRemoved: number = await Favorites.destroy({
            where: {
                id: id,
                userId: userId
            }
        });

        if (!favoriteRemoved) {
            res.status(400);
            return res.json({ error: "Error in deleting favorite, please try again" });
        };

        res.status(200);
        return res.json({ success: "Successfully removed favorite" });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    }
};

const clearFavorites = async(req: Request, res: Response) => {
    const userId: string = req.params.userId; // Takes in the User id for deleting all favoirtes

    if (!userId) {
        res.status(400);
        return res.json({ error: "No such user exist" });
    };

    try {
        const allFavoritesRemoved: number = await Favorites.destroy({
            where: {
                userId: userId
            }
        })

        if (!allFavoritesRemoved) {
            res.status(400);
            return res.json({ error: "Error in deleting all favorites, please try again" });
        };

        res.status(200);
        return res.json({ success: "Successfully deleted user Favorites" });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
}

export {
    addFavorite,
    getFavorites,
    deleteFavorite,
    clearFavorites
};