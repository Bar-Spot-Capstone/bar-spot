import User from "../models/Users";
import bcrypt from "bcrypt"
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
            return res.json({ error: `Failed to register, email is not unique with error: ${error.name}` });
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

            res.status(200);
            return res.json({ success: "Login Successful", email: email, username: user.username, user_id: user.id });
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
        const user: any = await User.destroy({
            where: {
                id: id
            }
        });

        if (!user) {
            res.status(400);
            return res.json({ error: "Failed to delete user" });
        }

        res.status(200);
        return res.json({ success: "Successfully deleted user" });
    }
    catch (error: any) {
        res.status(500);
        return res.json({ error: `Unexpected error occured with error: ${error}` });
    };

};

export {
    userRegister,
    userLogin,
    deleteUser
};
