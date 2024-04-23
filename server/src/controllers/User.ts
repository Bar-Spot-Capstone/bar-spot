import User from "../models/Users";
import bcrypt from "bcrypt"
import UserGroup from "../models/UserGroup";
import "dotenv/config";
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";
import { Request, Response } from "express";

const userRegister = async (req: Request, res: Response): Promise<Response> => {
    const { username, password, email }: { username: string, password: string, email: string } = req.body;

    if (!username || !password || !email) {
        res.status(400);
        return res.json({ error: "Failed to register missing fields" });
    };

    if (username === password) {
        res.status(400);
        return res.json({ error: "Failed to register username and password cannot be the same" });
    };

    const hashedPassword: string = await bcrypt.hash(password, 10);

    try {
        await User.create({
            username: username,
            password: hashedPassword,
            email: email
        });

        res.status(200)
        return res.json({ success: "Registeration Successful" });
    }
    catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400);
            return res.json({ error: `Failed to register, email is not unique` });
        }
        res.status(500);
        return res.json({ error: `Server failed with error ${error}` });
    };

};

const userLogin = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: { email: string, password: string } = req.body;
    var handleEmpty: string = ''
    handleEmpty = !email ? 'email' : '' || !password ? 'password' : '' //find missing parm

    if (handleEmpty) {
        res.status(400);
        return res.json({ error: `Failed to login missing field: ${handleEmpty}` })
    };

    try {
        const user: any = await User.findOne({
            where: {
                email: email,
            }
        });

        if (user) {
            //Need to check if rehashing the password is the same value
            const correctPassword = await bcrypt.compare(password, user.password);
            if (!correctPassword) {
                res.status(400);
                return res.json({ error: "Failed to login invaild password" });
            };

            //Json token created on login
            const userInformation = {
                email: email, 
                username: user.username, 
                user_id: user.id
            };

            const token = jwt.sign(userInformation, String(process.env.SECRETKEY), { expiresIn: '1d' });


            res.status(200);
            return res.json({ success: "Login Successful", token });
        }
        else {
            res.status(400);
            return res.json({ error: "Failed to login invaild credentials" });
        };
    }
    catch (error: any) {
        res.status(400);
        return res.json({ error: "Failed with unknown reason" });
    };
};

/*Having issues with this need to test it out and make sure it works*/

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id;

    if (!id) {
        res.status(400);
        return res.json({ error: "Failed to execute delete due to no id" });
    };

    try {
        const user: any = await User.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            res.status(400);
            return res.json({ error: "User does not exist" });
        };

        const userGroups: any = await UserGroup.findOne({
            where: {
                userId: user.id
            }
        });

        if (userGroups) {
            /*Need to check if user has any groups in UserGroup and need to handle that*/
            const groupsFound: any = await UserGroup.findAll({
                where: {
                    userId: user.id
                }
            });

            for (var i = 0; i < groupsFound.length; i++) {
                if (groupsFound[i].dataValues.role.toLowerCase() === 'owner') {
                    res.status(400);
                    return res.json({ error: "Failed to delete. User is current owner of a group" });
                };
            };
            //Now know that user is not a owner, thus need to delete all entries in Usergroup
            const deleteUserEntrie: any = await UserGroup.destroy({
                where: {
                    userId: user.id
                }
            });

            if (!deleteUserEntrie) {
                res.status(400);
                return res.json({ error: "Failed to delete. User is current a member of a group and failed to leave group" });
            }
        }

        const deleteRes = await User.destroy({
            where: {
                id: id
            }
        });

        if (!deleteRes) {
            res.status(400);
            return res.json({ error: "Failed to delete user" });
        };

        res.status(200);
        return res.json({ success: "Successfully deleted user" });

    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };
};

const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id;

    if (!id) {
        res.status(400);
        return res.json({ error: "Failed to execute GET due to no id" });
    };

    try {
        /*Check if requesting user exists*/
        const user: any = await User.findOne({
            where: {
                id: id
            }
        });

        if (!user) {
            res.status(400);
            return res.json({ error: "User does not exist" });
        };

        const findUsers = await User.findAll({
            where: {
                id: { [Op.notIn]: [id] }
            },
            // Attributes wanted
            attributes: ['id', 'username', 'email']
        });

        if (!findUsers) {
            res.status(200);
            return res.json({ success: "No other users exist" });
        };

        res.status(200);
        return res.json({ success: "Fetched all other users", users_list: findUsers });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };

};

export {
    userRegister,
    userLogin,
    deleteUser,
    getUsers
};
