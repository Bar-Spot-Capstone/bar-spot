import Group from "../models/Group";
import { Request, Response } from "express";

const addGroup = async (req: Request, res: Response): Promise<Response> => {
    const { name }: { name: string } = req.body;

    if (!name) {
        res.status(400);
        return res.json({ error: "Failed to create group with error: No group name provided" });
    };

    try {
        const group = await Group.create({
            name: name
        });
        if(group){
            res.status(200);
            return res.json({ success: "Group creation successful" });
        }
        else{
            res.status(400);
            return res.json({ error: "Failed to create group" });
        };
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Failed to create group with unexpected error: ${error}` })
    };
};

export {
    addGroup
};