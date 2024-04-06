import { Request, Response } from "express";
import Invitation from "../models/Invitations";
import User from "../models/Users";

/*
@param: userId -> retrieves invites based on the userid
*/
const getAllInvites = async (req: Request, res: Response): Promise<Response> => {
    const userId: string = req.params.userId;

    if (!userId) {
        res.status(400);
        return res.json({ error: "No userId provided" });
    };

    try {
        //Check if user exists
        const foundUser: any = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!foundUser) {
            res.status(400);
            return res.json({ error: 'User does not exisit' });
        };

        const invites: any = await Invitation.findAll({
            where: {
                invited_user: userId
            },
            attributes: ['id', 'status', 'groupId', 'invited_by']
        });

        const invitesFormatted: Array<object> = [];

        for (var key in invites) {
            const ownerName: any = await User.findOne({
                where: {
                    id: invites[key].dataValues.invited_by
                },
                attributes: ['username']
            });

            invitesFormatted.push({
                ownerName: ownerName.username,
                id: invites[key].dataValues.id,
                status: invites[key].dataValues.status,
                groupId: invites[key].dataValues.groupId
            });
        };

        res.status(200);
        return res.json({ success: "Retrieved all invites", invitesFormatted });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};

export {
    getAllInvites
};