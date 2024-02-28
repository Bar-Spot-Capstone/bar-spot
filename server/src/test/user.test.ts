import bcrypt from "bcrypt"
import User from "../models/Users";
import UserGroup from "../models/UserGroup";
import { userRegister, userLogin } from "../controllers/User";
import { UniqueConstraintError as SequelizeUniqueConstraintError } from 'sequelize';

// Mock User.create
jest.mock('../models/Users', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(), //to mock the findOne function
    destroy: jest.fn()
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
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to register, email is not unique with error: SequelizeUniqueConstraintError" });
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

/*

[
  UserGroup {
    dataValues: {
      id: 11,
      userId: 1,
      groupId: 14,
      role: 'Owner',
      createdAt: 2024-02-15T15:39:29.162Z,
      updatedAt: 2024-02-15T15:39:29.162Z
    },
    _previousDataValues: {
      id: 11,
      userId: 1,
      groupId: 14,
      role: 'Owner',
      createdAt: 2024-02-15T15:39:29.162Z,
      updatedAt: 2024-02-15T15:39:29.162Z
    },
    uniqno: 1,
    _changed: Set(0) {},
    _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [Array]
    },
    isNewRecord: false
  },
  UserGroup {
    dataValues: {
      id: 15,
      userId: 1,
      groupId: 17,
      role: 'Owner',
      createdAt: 2024-02-15T16:12:57.046Z,
      updatedAt: 2024-02-15T16:12:57.046Z
    },
    _previousDataValues: {
      id: 15,
      userId: 1,
      groupId: 17,
      role: 'Owner',
      createdAt: 2024-02-15T16:12:57.046Z,
      updatedAt: 2024-02-15T16:12:57.046Z
    },
    uniqno: 1,
    _changed: Set(0) {},
    _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [Array]
    },
    isNewRecord: false
  }
*/