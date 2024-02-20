import UserGroup from "../models/UserGroup";
import User from "../models/Users";
import Group from "../models/Group";
import { inviteUser, createUserGroup, getMembers, deleteParty, removeMember } from "../controllers/UserGroup";

// Mock Group.create and findOne
jest.mock('../models/Group', (): any => ({
    create: jest.fn(),
    findOne: jest.fn() //to mock the findOne function
}));

// Mock UserGroup.create and findOne
jest.mock('../models/UserGroup', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(), //to mock the findOne function
    findAll: jest.fn(), //to mock the findAll function
    destroy: jest.fn() //to mock the findAll function
}));

// Mock User.findOne
jest.mock('../models/Users', (): any => ({
    findOne: jest.fn() //to mock the findOne function
}));

const res: any = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
};

/*UserGroup creation test*/
describe('On invaild user_group input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if user_group has missing name', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create group missing field: name" });
    });

    it('should return a status code of 400 and error if user_group has missing userId', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: ""
            }
        };

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create group missing field: userId" });
    });

    it('should return a status code of 400 and error if user_group has missing userId', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (Group as any).create.mockResolvedValue(false);
        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create group for user_group" });
    });

    it('should return a status code of 400 and error if user_group has missing userId', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (Group as any).create.mockResolvedValue(true);
        (UserGroup as any).create.mockResolvedValue(false);

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create user_group" });
    });

    it('should return a status code of 500 and error if an unexpected error occurs', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        // Mock Group.create to throw an error
        (Group as any).create.mockRejectedValue(new Error("Unexpected error"));

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Unexpected error occured with error: Error: Unexpected error" });
    });
});

describe('On vaild user_group input', (): void => {
    it('should return a status code of 200 and confirmation message if user_group was created', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (Group as any).create.mockResolvedValue(true);
        (UserGroup as any).create.mockResolvedValue({
            userId: Number.MAX_SAFE_INTEGER,
            groupId: Number.MAX_SAFE_INTEGER,
            role: "Owner"
        });

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Group creation successful", groupId: Number.MAX_SAFE_INTEGER });
    });
});

/*UserGroup invitation test case*/
describe('On invaild user_group invitation input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if user_group has missing userId', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: ""
            }
        };

        await inviteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to invite user missing field: userId" });
    });

    it('should return a status code of 400 and error if user_group has missing groupId', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: "",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        await inviteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to invite user missing field: groupId" });
    });

    it('should return a status code of 400 and error if user is already in the group', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(true);
        (User as any).findOne.mockResolvedValue(true);
        (UserGroup as any).findOne.mockResolvedValueOnce(true);

        await inviteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: `Already in this group` });
    });

    it('should return a status code of 400 and error if user doesnt exisit', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(true);
        (User as any).findOne.mockResolvedValue(false);
        (UserGroup as any).findOne.mockResolvedValueOnce(false);

        await inviteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No such user exisit" });
    });

    it('should return a status code of 400 and error if group doesnt exisit', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(false);
        (User as any).findOne.mockResolvedValue(true);
        (UserGroup as any).findOne.mockResolvedValueOnce(false);

        await inviteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No such group exisit" });
    });

    it('should return a status code of 500 and error if an unexpected error occurs', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        // Mock Group.create to throw an error
        (UserGroup as any).findOne.mockRejectedValue(new Error("Unexpected error"));

        await inviteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Unexpected error occured with error: Error: Unexpected error" });
    });
});

describe('On vaild user_group invitation input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and confirmation message if user was added to group', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(true);
        (User as any).findOne.mockResolvedValueOnce(true);
        (UserGroup as any).findOne.mockResolvedValueOnce(false);

        await inviteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Successfully added to group" });
    });
});

/*UserGroup get all party members test*/
describe('On invaild get all party members input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if groupId is missing from params', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: null
            }
        };

        await getMembers(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No groupId provided" });
    });

    it('should return a status code of 400 and error if group doesnt exist', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(false);

        await getMembers(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No such group exist" });
    });

});

describe('On vaild get all party members input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and list of all users in the group', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(true);
        (UserGroup as any).findAll.mockResolvedValueOnce([
            {
                dataValues: {
                    id: Number.MIN_VALUE,
                    role: 'Owner',
                    userId: Number.MIN_VALUE,
                    groupId: Number.MAX_SAFE_INTEGER
                }
            }
        ]);

        (User as any).findOne.mockResolvedValueOnce({
            id: Number.MIN_VALUE,
            username: 'Deondrae',
            password: 'HashedPassword',
            email: 'dev@deving.com'
        });

        await getMembers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            "members": [
                [
                    "Deondrae",
                    "Owner",
                    Number.MIN_VALUE
                ]
            ]
        });
    });
});

/*UserGroup test delete party methods*/
describe('On invaild delete party input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error message if id is missing in the request', async (): Promise<void> => {
        const req: any = {
            params: {
                id: null
            }
        };

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No such group exist" });
    });

    it('should return a status code of 400 and error message if the party couldnt be deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).destroy.mockResolvedValueOnce(false);

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Party is unabled to be destroyed at this moment" });
    });

});

describe('On vaild delete party input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and success message if party was deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).destroy.mockResolvedValueOnce(true);

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Successfully deleted party" });
    });
});

/*UserGroup test delete members methods*/
describe('On invaild delete party member input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error message if userId is missing', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: null,
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        await removeMember(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: userId" });
    });

    it('should return a status code of 400 and error message if groupId is missing', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER,
                groupId: null
            }
        };

        await removeMember(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: groupId" });
    });

    it('should return a status code of 400 and error message if owner of large group tries to leave', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER - 1,
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "Owner"
        });

        (UserGroup as any).findAll.mockResolvedValueOnce([
            {
                role: 'Owner',
                userId: Number.MAX_SAFE_INTEGER - 1,
            },
            {
                role: 'member', userId: Number.MAX_SAFE_INTEGER
            }
        ]);

        await removeMember(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Cannot leave party as the owner while there are other memebers" });
    });

    it('should return a status code of 400 and error message if member was not deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "Owner"
        });

        (UserGroup as any).findAll.mockResolvedValueOnce([
            {
                role: 'Owner',
                userId: Number.MAX_SAFE_INTEGER,
            }
        ]);

        (UserGroup as any).destroy.mockResolvedValueOnce(false);

        await removeMember(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Error in deleting member, please try again" });
    });

});

describe('On vaild delete party member input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and success message member was deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "Owner"
        });

        (UserGroup as any).findAll.mockResolvedValueOnce([
            {
                role: 'Owner',
                userId: Number.MAX_SAFE_INTEGER,
            }
        ]);

        (UserGroup as any).destroy.mockResolvedValueOnce(true);

        await removeMember(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Successfully removed member" });
    });
});