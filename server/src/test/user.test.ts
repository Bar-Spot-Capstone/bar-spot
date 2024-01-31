import bcrypt from "bcrypt"
import { userRegister } from "../controllers/User";
import { UniqueConstraintError as SequelizeUniqueConstraintError } from 'sequelize';
import User from "../models/Users";

// Mock User.create
jest.mock('../models/Users', () => ({
    create: jest.fn()
}));

// Mock bcrypt.hash
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedpassword')
}));

const res: any = {
    /*Due to the return type, we have to return the status as a json object containing the HTTPS status and the response()*/
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
};

/*User registeration test case*/
describe('On invaild user registeration', (): void => {
    it('should return a status code of 400 and error if user has missing fields', async (): Promise<void> => {
        const req: any = {
            body: {
                username: "",
                password: "",
                email: ""
            }
        };

        await userRegister(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to register missing fields" });
    });

    it('should return a status code of 400 and error if user enters the same password and username', async (): Promise<void> => {
        const req: any = {
            body: {
                username: "dev",
                password: "dev",
                email: "dev@deving.com"
            }
        };
        await userRegister(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to register username and password cannot be the same" });
    });

    it('should return a status code of 400 and error if user enters a pre-existing email', async (): Promise<void> => {
        const req: any = {
            body: {
                username: "newUser",
                password: "password",
                email: "existing@email.com"
            }
        };
        // Mock User.create to throw SequelizeUniqueConstraintError
        (User as any).create.mockRejectedValue(new SequelizeUniqueConstraintError({}));

        await userRegister(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);// Expect bcrypt.hash to be called with the provided password
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to register, email is not unique with error: SequelizeUniqueConstraintError" });
    });
});

describe('On successful user registeration', (): void => {
    it('should return a status code of 200 and add the user to the data base', async (): Promise<void> => {
        const req: any = {
            body: {
                username: "newUser",
                password: "password",
                email: "captstone@499.com"
            }
        };

        (User as any).create.mockResolvedValue(true);
        await userRegister(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);// Expect bcrypt.hash to be called with the provided password
        expect(res.json).toHaveBeenCalledWith({ success: "Registeration Successful" });
    });
});