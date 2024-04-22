import Invitation from "../models/Invitations";
import User from "../models/Users";
import UserGroup from "../models/UserGroup";
import Group from "../models/Group";
import { getAllInvites, respondToInvite } from "../controllers/Invitations";

// Mock Invites.create and findOne
jest.mock('../models/Invitations', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn()
}));

// Mock UserGroup.create and findOne
jest.mock('../models/UserGroup', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
}));

// Mock User.findOne
jest.mock('../models/Users', (): any => ({
    findOne: jest.fn() //to mock the findOne function
}));

// Mock Group.findAll
jest.mock('../models/Group', (): any => ({
    findAll: jest.fn() //to mock the findOne function
}));

const res: any = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
};

/*Invite get invite test*/
describe('On invaild get invites input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if userId is missing', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: null
            }
        };

        await getAllInvites(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No userId provided" });
    });

    it('should return a status code of 400 and error if user is not found', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);

        await getAllInvites(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User does not exisit' });
    });
});

describe('On vaild get invites input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and success message with a list of all invites', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Invitation as any).findAll.mockResolvedValueOnce({
            Invite: {
                dataValues: {
                    id: Number.MAX_SAFE_INTEGER,
                    status: "Pending",
                    groupId: Number.MAX_SAFE_INTEGER - 1,
                    invited_by: Number.MAX_SAFE_INTEGER
                }
            }
        });
        (User as any).findOne.mockResolvedValueOnce({
            username: "Dev"
        });
        (Group as any).findAll.mockResolvedValueOnce([{
            dataValues: {
                name: 'Front-end Test Integration',
            }
        }]);

        await getAllInvites(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: "Retrieved all invites", invitesFormatted: [{
                "groupId": Number.MAX_SAFE_INTEGER - 1,
                "id": Number.MAX_SAFE_INTEGER,
                "ownerName": "Dev",
                "status": "Pending",
                "groupName": "Front-end Test Integration",
                "numberOfMembers": 1
            }]
        });
    });
});
/*Invite response test cases*/
describe('On invaild get respond to invite input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error message if missing groupId', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: "",
                userId: Number.MAX_SAFE_INTEGER,
                response: false
            }
        };

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to invite user to group, missing field: groupId" });
    });

    it('should return a status code of 400 and error message if missing userId', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: null,
                response: false
            }
        };

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to invite user to group, missing field: userId" });
    });

    it('should return a status code of 400 and error message if missing response', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                response: null
            }
        };

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to invite user to group, missing field: response" });
    });

    it('should return a status code of 400 and error message if fail to reject invite', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                response: false
            }
        };

        (Invitation as any).destroy.mockResolvedValueOnce(false);

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to reject invitation" });
    });

    it('should return a status code of 400 and error message if invitee is already in a group', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                response: true
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(true);

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to join group user is already in a group" });
    });

    it('should return a status code of 400 and error message if error occured in joing group', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                response: true
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(false);
        (UserGroup as any).create.mockResolvedValueOnce(false);

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to join group" });
    });

});

describe('On vaild get respond to invite input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and success message if invite was rejected', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                response: false
            }
        };

        (Invitation as any).destroy.mockResolvedValueOnce(true);

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Rejected invite" });
    });

    it('should return a status code of 200 and success message if invite was accpeted', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                response: true
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(false);
        (UserGroup as any).create.mockResolvedValueOnce(true);
        (Invitation as any).destroy.mockResolvedValueOnce(true);

        await respondToInvite(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Joined group" });
    });

});