import Visited from "../models/Visited";
import {Request, Response} from "express";

const newVisited = async (req: Request, res: Response): Promise<Response> => {
    const {bar_name, address}: {bar_name: string, address: string} = req.body;
    if(!bar_name || !address){
        res.status(400);
        return res.json({ error: "Failed to register missing feilds"});
    }

    try {
        await Visited.create({
            bar_name: bar_name,
            address: address
        });

        res.status(200)
        return res.json({ success: "Sucesfully added to Visited Table!"});

        
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Failed to add visited bar with unexpected error: ${error}` })
    };
};

export{
    newVisited
}