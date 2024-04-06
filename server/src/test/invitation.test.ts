import Invitation from "../models/Invitations";
import User from "../models/Users";
import UserGroup from "../models/UserGroup";
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

        await getAllInvites(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: "Retrieved all invites", invitesFormatted: [{
                "groupId": Number.MAX_SAFE_INTEGER - 1,
                "id": Number.MAX_SAFE_INTEGER,
                "ownerName": "Dev",
                "status": "Pending",
            }]
        });
    });
});