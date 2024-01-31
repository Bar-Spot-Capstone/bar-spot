import bcrypt from "bcrypt"
import { Request, Response } from "express";
import { userRegister } from "../controllers/User";

// Mock User.create
jest.mock('../models/Users', () => ({
    create: jest.fn()
}));

// Mock bcrypt.hash
jest.mock('bcrypt', () => ({
    hash: jest.fn()
}));

const res: any = {
    /*Due to the return type, we have to return the status as a json object containing the HTTPS status and the response()*/
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
};

/*User registeration test case*/
describe('On invaild user registeration', ()=>{
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
});