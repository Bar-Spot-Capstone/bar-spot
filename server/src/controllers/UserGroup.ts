import { Request, Response } from "express";
import UserGroup from "../models/UserGroup";
import User from "../models/Users";
import Group from "../models/Group";

const createUserGroup = async (req: Request, res: Response): Promise<Response> => {
    //take in userId for user creating the group, and name of the group
    const { userId, name }: { userId: number, name: string } = req.body;

    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !name ? 'name' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to create group missing field: ${handleEmpty}` });
    };

    try {
        const group: any = await Group.create({
            name: name
        });

        if (!group) {
            res.status(400);
            return res.json({ error: "Failed to create group for user_group" });
        }

        const user_group = await UserGroup.create({
            userId: userId,
            groupId: group.id,
            role: "Owner"
        });

        if (!user_group) {
            res.status(400);
            return res.json({ error: "Failed to create user_group" });
        };

        res.status(200);
        return res.json({ success: "Group creation successful", groupId: user_group.groupId });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};

const inviteUser = async (req: Request, res: Response): Promise<Response> => {
    //Need to take in the user being invited id, group inviting to id
    const { userId, groupId }: { userId: number, groupId: number } = req.body;

    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !groupId ? 'groupId' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to invite user missing field: ${handleEmpty}` });
    };

    try {
        //Check if group exist in the table 
        const group: any = await UserGroup.findOne({
            where: {
                groupId: groupId
            }
        });

        //Check if user exist
        const user: any = await User.findOne({
            where: {
                id: userId
            }
        });

        //Checks if the user is already in the group that there trying to join
        const alreadyInGroup: any = await UserGroup.findOne({
            where: {
                groupId: groupId,
                userId: userId
            }
        });

        if (alreadyInGroup) {
            res.status(400);
            return res.json({ error: `Already in this group` });
        };

        if (group && user) {
            await UserGroup.create({
                userId: userId,
                groupId: groupId,
                role: "member"
            });

            res.status(200);
            return res.json({ success: "Successfully added to group" });
        }
        else {
            res.status(400);
            if (!user) {
                return res.json({ error: "No such user exisit" });
            };
            return res.json({ error: "No such group exisit" });
        };
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };

};

const getMembers = async (req: Request, res: Response): Promise<Response> => {
    const groupId: string = req.params.groupId;

    if (!groupId) {
        res.status(400);
        return res.json({ error: "No groupId provided" });
    };

    try {
        //Check if group exist in the table 
        const group: any = await UserGroup.findOne({
            where: {
                groupId: groupId
            }
        });

        if (!group) {
            res.status(400);
            return res.json({ error: "No such group exist" });
        };

        const party: any = await UserGroup.findAll({
            where: {
                groupId: parseInt(groupId)
            },
            // Attributes wanted
            attributes: ['id', 'role', 'userId', 'groupId']
        });

        const members: Array<Array<any>> = [];

        for (let i = 0; i < party.length; i++) {
            const userId: number = party[i].dataValues.userId;
            const user: any = await User.findOne({
                where: {
                    id: userId
                }
            });
            members.push([user.username, party[i].dataValues.role, user.id]);
        };

        res.status(200);
        return res.json({ members });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};

const deleteParty = async (req: Request, res: Response): Promise<Response> => {
    const groupId: string = req.params.groupId; // Takes in the UserGroup id for deleting the party

    if (!groupId) {
        res.status(400);
        return res.json({ error: "No such group exist" });
    };

    try {
        const partyDeleted: number = await UserGroup.destroy({
            where: {
                groupId: groupId
            }
        });

        if (!partyDeleted) {
            res.status(400);
            return res.json({ error: "Party is unabled to be destroyed at this moment" });
        }

        res.status(200);
        return res.json({ success: "Successfully deleted party" });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };

};

const removeMember = async (req: Request, res: Response): Promise<Response> => {
    const userId: string = req.params.userId
    const groupId: string = req.params.groupId

    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !groupId ? 'groupId' : '' //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Unable to read: ${handleEmpty}` })
    };

    try {
        const member: any = await UserGroup.findOne({
            where: {
                groupId: groupId,
                userId: userId
            },
            attributes: ['role']
        });

        if (member.role.toLowerCase() === 'owner') {
            const party: any = await UserGroup.findAll({
                where: {
                    groupId: groupId
                },
                attributes: ['role', 'userId']
            });

            if (party.length > 1) {
                res.status(400);
                return res.json({ error: "Cannot leave party as the owner while there are other memebers" });
            };
        }

        const memberRemoved: number = await UserGroup.destroy({
            where: {
                groupId: groupId,
                userId: userId
            }
        });

        if (!memberRemoved) {
            res.status(400);
            return res.json({ error: "Error in deleting member, please try again" });
        };
        res.status(200);
        return res.json({ success: "Successfully removed member" });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};


export {
    createUserGroup,
    inviteUser,
    getMembers,
    deleteParty,
    removeMember
};