import { Request, Response } from "express";
import UserGroup from "../models/UserGroup";
import User from "../models/Users";
import Group from "../models/Group";

const createUserGroup = async (req: Request, res: Response): Promise<Response> => {
    //take in userid for user creating the group, and name of the group
    const { userid, name }: { userid: number, name: string } = req.body;

    var handleEmpty: string = ''
    handleEmpty = !userid ? 'userid' : '' || !name ? 'name' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to login missing field: ${handleEmpty}` });
    };

    try {
        const group: any = await Group.create({
            name: name
        });

        await UserGroup.create({
            userid: userid,
            groupId: group.id,
            role: "Owner"
        });

        res.status(200);
        return res.json({ success: "Group creation Successful" });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error ${error}` });
    };
};

const inviteUser = async (req: Request, res: Response): Promise<Response> => {
    //Need to take in the user being invited id, group inviting to id
    const { userid, groupId }: { userid: number, groupId: number } = req.body;

    var handleEmpty: string = ''
    handleEmpty = !userid ? 'userid' : '' || !groupId ? 'groupId' : ''; //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to login missing field: ${handleEmpty}` });
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
                userid: userid
            }
        });

        if (group && user) {
            await UserGroup.create({
                userid: userid,
                groupId: groupId,
                role: "member"
            });

            res.status(200);
            return res.json({ success: "Successfully added to group" });
        }
        else {
            res.status(400);
            return res.json({ error: "No such group exisit" });
        };
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error ${error}` });
    };

};

export {
    createUserGroup,
    inviteUser
};