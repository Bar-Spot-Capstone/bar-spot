import { Request, Response } from "express";
import UserGroup from "../models/UserGroup";
import User from "../models/Users";
import Group from "../models/Group";
import Invitation from "../models/Invitations";

/*
@params: userId -> Used for creating the owner of the group
@params: name -> Used for the name of the group
@params: invitedUsers -> Used to invite list of users
*/
const createUserGroup = async (req: Request, res: Response): Promise<Response> => {

    const { userId, name, invitedUsers }: { userId: number, name: string, invitedUsers: Object } = req.body;

    //Should return status 400 if userId or name of the group is not provided
    var handleEmpty: string = ''
    handleEmpty = !userId ? 'userId' : '' || !name ? 'name' : '';

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to create group missing field: ${handleEmpty}` });
    };

    try {
        //Check if user exists
        const foundUser = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!foundUser) {
            res.status(400);
            return res.json({ error: 'User does not exisit' });
        };

        //Check if creater is already in Group
        const alreadyInGroup = await UserGroup.findOne({
            where: {
                userId: foundUser.id
            }
        });

        if (alreadyInGroup) {
            res.status(400);
            return res.json({ error: "User is already in group" });
        };

        if (invitedUsers && Object.keys(invitedUsers).length !== 0) {
            /*User is attempting to create group and invite members*/
            let usersInGroup: Array<any> = [];

            for (const [key, value] of Object.entries(invitedUsers)) {
                //Expecting invitedUsers[key] to be userId - Checks is users are already in group
                const foundGroup: any = await UserGroup.findOne({
                    where: {
                        userId: value
                    }
                });

                if (foundGroup) {
                    usersInGroup.push(value);
                };
            };

            if (usersInGroup.length !== 0) {
                /*If there are users already in a group*/
                const users: Array<string> = [];

                for (var ids of usersInGroup) {
                    const res: any = await User.findOne({
                        where: {
                            id: ids
                        },
                        attributes: ['username']
                    });

                    users.push(res.username);
                };

                res.status(200);
                return res.json({ message: `Users already in group`, users: users })
            };
            //Else all the invited users are not in a group - Create group and invites
            const group: any = await Group.create({
                name: name
            });

            if (!group) {
                res.status(400);
                return res.json({ error: `Failed to create group for ${foundUser.username}` });
            };

            const user_group = await UserGroup.create({
                userId: userId,
                groupId: group.id,
                role: "Owner"
            });

            if (!user_group) {
                res.status(400);
                return res.json({ error: "Failed to create user_group" });
            };

            //Now invite members
            for (const [key, value] of Object.entries(invitedUsers)) {
                //Expecting invitedUsers[key] to be userId - Creates a invite to each user
                await Invitation.create({
                    status: "Pending",
                    groupId: user_group.groupId,
                    invited_by: foundUser.id,
                    invited_user: value
                });
            };

            res.status(200);
            return res.json({ success: "Group creation and invitation creation successful", groupId: user_group.groupId });

        }
        else {
            const group: any = await Group.create({
                name: name
            });

            if (!group) {
                res.status(400);
                return res.json({ error: `Failed to create group for ${foundUser.username}` });
            };

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
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};
/*
@param: groupdId -> id of group to send invite to
@param: ownerId -> id of owner of the group whose sending invite
@param: invitedUsers -> Object containing userIds to invite
*/
const inviteMember = async (req: Request, res: Response): Promise<Response> => {
    const { groupId, ownerId, invitedUsers }: { groupId: number, ownerId: number, invitedUsers: Object } = req.body;

    //Should return status 400 if Ids or invites are empty
    var handleEmpty: string = ''
    handleEmpty = !groupId ? 'groupId' : '' || !ownerId ? 'ownerId' : '' || !invitedUsers ? 'invited Users' : '';

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to invite user to group, missing field: ${handleEmpty}` });
    };

    try {
        if (invitedUsers && Object.keys(invitedUsers).length !== 0) {
            /*User is attempting to invite members*/
            let usersInGroup: Array<any> = [];

            for (const [key, value] of Object.entries(invitedUsers)) {
                //Expecting invitedUsers[key] to be userId - Checks is users are already in group
                const foundGroup: any = await UserGroup.findOne({
                    where: {
                        userId: value
                    }
                });

                if (foundGroup) {
                    usersInGroup.push(value);
                };
            };

            if (usersInGroup.length !== 0) {
                /*If there are users already in a group*/
                const users: Array<string> = [];

                for (var ids of usersInGroup) {
                    const res: any = await User.findOne({
                        where: {
                            id: ids
                        },
                        attributes: ['username']
                    });

                    users.push(res.username);
                };

                res.status(200);
                return res.json({ message: `Users already in group`, users: users })
            };
            //Else all the invited users are not in a group - Create invites
            //Check if invite already sent
            let inviteCount: number = 0;

            for (const [key, value] of Object.entries(invitedUsers)) {
                //Expecting invitedUsers[key] to be userId - Creates a invite to each user
                const alreadyInvited = await Invitation.findOne({
                    where: {
                        groupId: groupId,
                        invited_by: ownerId,
                        invited_user: value
                    }
                });

                if (!alreadyInvited) {
                    inviteCount++;
                    await Invitation.create({
                        status: "Pending",
                        groupId: groupId,
                        invited_by: ownerId,
                        invited_user: value
                    });
                };
            };
            if (inviteCount === 0) {
                res.status(400);
                return res.json({ error: "Invitation has already been sent to users" });
            };

            res.status(200);
            return res.json({ success: "Invitation sent successfully" });
        }
        res.status(200);
        return res.json({ message: "No users indicated to invite" });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};
/*
@param: groupId -> id of group to get members from
*/
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
/*
@param: groupId -> id of group to delete
*/
const deleteParty = async (req: Request, res: Response): Promise<Response> => {
    const groupId: string = req.params.groupId;

    if (!groupId) {
        res.status(400);
        return res.json({ error: "No such group exist" });
    };

    try {
        /*Need to destroy all invites assoicated with groupId  -   Need to destroy group - destroying Invites may lead to null if there are no invites*/
        const destroyInvites = await Invitation.destroy({
            where: {
                groupId: groupId
            }
        });

        const partyDeleted: number = await UserGroup.destroy({
            where: {
                groupId: groupId
            }
        });

        const groupDeleted: number = await Group.destroy({
            where: {
                id: groupId
            }
        });

        if (!partyDeleted || !groupDeleted) {
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
/*
@param: userId -> Id of user to delete
@param: groupId -> groupId to remove user from
*/
const leaveParty = async (req: Request, res: Response): Promise<Response> => {
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
            /*Owner has to delete party instead of leaving*/
            res.status(400);
            return res.json({ error: "Cannot leave party as the owner please delete party" });
        };

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
    inviteMember,
    getMembers,
    deleteParty,
    leaveParty
};