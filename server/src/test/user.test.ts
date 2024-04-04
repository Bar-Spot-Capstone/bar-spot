import bcrypt from "bcrypt"
import User from "../models/Users";
import UserGroup from "../models/UserGroup";
import Preferences from "../models/Preferences";
import { userRegister, userLogin, deleteUser, getUsers } from "../controllers/User";
import { UniqueConstraintError as SequelizeUniqueConstraintError } from 'sequelize';

// Mock User
jest.mock('../models/Users', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(), //to mock the findOne function
    findAll: jest.fn(),
    destroy: jest.fn()
}));

// Mock Preferences.create
jest.mock('../models/Preferences', (): any => ({
    create: jest.fn()
}));

// Mock UserGroup.create and findOne
jest.mock('../models/UserGroup', (): any => ({
    findOne: jest.fn(), //to mock the findOne function
    findAll: jest.fn(), //to mock the findAll function
    destroy: jest.fn()
}));

// Mock bcrypt.hash
jest.mock('bcrypt', (): any => ({
    hash: jest.fn().mockResolvedValue('hashedpassword'),
    compare: jest.fn()
}));

const res: any = {
    /*Due to the return type, we have to return the status as a json object containing the HTTPS status and the response()*/
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
};

/*User registeration test case*/
describe('On invaild user registeration', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

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
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to register, email is not unique" });
    });
});

describe('On successful user registeration', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and add the user to the data base', async (): Promise<void> => {
        const req: any = {
            body: {
                username: "newUser",
                password: "password",
                email: "captstone@499.com"
            }
        };

        (User as any).create.mockResolvedValue(true);
        (Preferences as any).create.mockResolvedValue(true);
        await userRegister(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);// Expect bcrypt.hash to be called with the provided password
        expect(res.json).toHaveBeenCalledWith({ success: "Registeration Successful" });
    });
});

/*User login test case*/
describe('On invaild user login', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and report missing password', async (): Promise<void> => {
        const req: any = {
            body: {
                password: "",
                email: "captstone@499.com"
            }
        };

        await userLogin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to login missing field: password" });
    });

    it('should return a status code of 400 and report missing email', async (): Promise<void> => {
        const req: any = {
            body: {
                password: "password",
                email: ""
            }
        };

        await userLogin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to login missing field: email" });
    });

    it('should return a status code of 400 and error indicating user inputted invaild credentials', async (): Promise<void> => {
        const req: any = {
            body: {
                password: "password",
                email: "test@email"
            }
        };

        (User as any).findOne.mockResolvedValue(null);

        await userLogin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to login invaild credentials" });
    });

    it('should return a status code of 400 and error indicating user inputted invaild password', async (): Promise<void> => {
        const req: any = {
            body: {
                password: "password",
                email: "test@email"
            }
        };

        (User as any).findOne.mockResolvedValue({
            password: "password",
            email: "test@email",
            id: `${Number.MAX_SAFE_INTEGER}`
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await userLogin(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to login invaild password" });
    });
});

describe('On successful user login', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and the user_id', async (): Promise<void> => {
        const req: any = {
            body: {
                password: "password",
                email: "test@email"
            }
        };

        (User as any).findOne.mockResolvedValue({
            password: "password",
            email: "test@email",
            username: 'capstone',
            id: `${Number.MAX_SAFE_INTEGER}`
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        await userLogin(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Login Successful", email: 'test@email', username: 'capstone', user_id: `${Number.MAX_SAFE_INTEGER}` });
    });
});

/*User delete testcase*/
describe('On invaild user delete', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if id is missing', async (): Promise<void> => {
        const req: any = {
            params: {
                id: null
            }
        };

        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to execute delete due to no id" });

    });

    it('should return a status code of 400 and error if user is not found', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);

        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User does not exist" });
    });

    it('should return a status code of 400 and error if user is a current owner of a group', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                name: "Capstone",
                email: "capstone@gmail.com",
                password: "hashedpassword"
            }
        });

        (UserGroup as any).findOne.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'Owner'
            }
        }]);

        (UserGroup as any).findAll.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'Owner'
            }
        }]);

        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete. User is current owner of a group" });
    });

    it('should return a status code of 400 and error if failed to delete user that is in group', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                name: "Capstone",
                email: "capstone@gmail.com",
                password: "hashedpassword"
            }
        });

        (UserGroup as any).findOne.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'member'
            }
        }]);

        (UserGroup as any).findAll.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'member'
            }
        }]);

        (UserGroup as any).destroy.mockResolvedValueOnce(false);

        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete. User is current a member of a group and failed to leave group" });
    });

    it('should return a status code of 400 and error if failed to delete user', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                name: "Capstone",
                email: "capstone@gmail.com",
                password: "hashedpassword"
            }
        });

        (UserGroup as any).findOne.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'member'
            }
        }]);

        (UserGroup as any).findAll.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'member'
            }
        }]);

        (UserGroup as any).destroy.mockResolvedValueOnce(true);

        (User as any).destroy.mockResolvedValueOnce(false);

        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete user" });
    });
});

describe('On vaild user delete', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and delete the user if they are not apart of a group', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                name: "Capstone",
                email: "capstone@gmail.com",
                password: "hashedpassword"
            }
        });

        (UserGroup as any).findOne.mockResolvedValueOnce(false);

        (User as any).destroy.mockResolvedValueOnce(true);

        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Successfully deleted user" });
    });

    it('should return a status code of 200 and delete the user if they are apart of a group and not the owner of the group', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                name: "Capstone",
                email: "capstone@gmail.com",
                password: "hashedpassword"
            }
        });

        (UserGroup as any).findOne.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'member'
            }
        }]);

        (UserGroup as any).findAll.mockResolvedValueOnce([{
            dataValues: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER,
                role: 'member'
            }
        }]);

        (UserGroup as any).destroy.mockResolvedValueOnce(true);

        (User as any).destroy.mockResolvedValueOnce(true)

        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Successfully deleted user" });
    });
});

/*Get all other user test cases*/
describe('On invaild get users', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error message if id is missing', async (): Promise<void> => {
        const req: any = {
            params: {
                id: null
            }
        };

        await getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to execute GET due to no id" });
    });

    it('should return a status code of 400 and error message if user does not exist', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);

        await getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User does not exist" });
    });
});

describe('On vaild get users', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and success message if there are no other users', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (User as any).findAll.mockResolvedValueOnce(false);

        await getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "No other users exist" });
    });

    it('should return a status code of 200 and success message and list of all other users', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (User as any).findAll.mockResolvedValueOnce([{
            "id": 1,
            "username": "jon",
            "email": "jon@practice.com"
        }]);

        await getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Fetched all other users", users_list: [{ "email": "jon@practice.com", "id": 1, "username": "jon", }] });
    });
});