import { Request, Response } from "express";
import Invitation from "../models/Invitations";
import User from "../models/Users";
import UserGroup from "../models/UserGroup";

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

const respondToInvite = async (req: Request, res: Response): Promise<Response> => {
    const { userId, groupId, response }: { userId: number, groupId: number, response: boolean } = req.body;

    //Should return status 400 if fields are missing
    var handleEmpty: string = ''
    handleEmpty = !groupId ? 'groupId' : '' || !userId ? 'ownerId' : '' || response === null ? 'response' : '';

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to invite user to group, missing field: ${handleEmpty}` });
    };

    try {
        if (!response) {
            //if user does not want to join the usergroup - delete invite that the user has for that groupId
            const deleteInvite = await Invitation.destroy({
                where: {
                    groupId: groupId,
                    invited_user: userId
                }
            });

            if (!deleteInvite) {
                res.status(400);
                return res.json({ error: "Failed to reject invitation" });
            }
            res.status(200);
            return res.json({ success: "Rejected invite" });
        }
        //if true add to the group and destroy all invites for the user     
        const alreadyInGroup: any = await UserGroup.findOne({
            where: {
                userId: userId
            }
        });

        if (alreadyInGroup) {
            res.status(400);
            return res.json({ error: "Failed to join group user is already in a group" });
        };

        const joinUserGroup: any = await UserGroup.create({
            userId: userId,
            groupId: groupId,
            role: "member"
        });

        if (!joinUserGroup) {
            res.status(400);
            return res.json({ error: "Failed to join group" });
        };

        const deleteAllInvites = await Invitation.destroy({
            where: {
                invited_user: userId
            }
        });

        res.status(200);
        return res.json({ success: "Joined group" });

    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};

export {
    getAllInvites,
    respondToInvite
};