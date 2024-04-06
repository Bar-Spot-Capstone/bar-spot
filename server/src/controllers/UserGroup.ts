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

export {
    createUserGroup
};