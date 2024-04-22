import UserGroup from "../models/UserGroup";
import User from "../models/Users";
import Group from "../models/Group";
import Invitation from "../models/Invitations";
import { inviteMember, createUserGroup, getMembers, deleteParty, leaveParty, getGroupInformation } from "../controllers/UserGroup";

// Mock Group.create and findOne
jest.mock('../models/Group', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(), //to mock the findOne function
    destroy: jest.fn() //to mock the destroy function
}));

// Mock Invites.create and findOne
jest.mock('../models/Invitations', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(), //to mock the findOne function
    destroy: jest.fn() //to mock the destroy function
}));

// Mock UserGroup.create and findOne
jest.mock('../models/UserGroup', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(), //to mock the findOne function
    findAll: jest.fn(), //to mock the findAll function
    destroy: jest.fn() //to mock the destroy function
}));

// Mock User.findOne
jest.mock('../models/Users', (): any => ({
    findOne: jest.fn() //to mock the findOne function
}));

const res: any = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
};

/*UserGroup createUserGroup test*/
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


    it('should return a status code of 400 and error if user does not exist', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);
        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User does not exisit" });
    });

    it('should return a status code of 400 and error if user is already in a group', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (UserGroup as any).findOne.mockResolvedValueOnce(true);

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User is already in group" });
    });

    it('should return a status code of 400 and error if failed to create group', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            username: 'Dev',
            id: req.userId
        });
        (UserGroup as any).findOne.mockResolvedValueOnce(false);
        (Group as any).create.mockResolvedValueOnce(false);
        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create group for Dev" });
    });

    it('should return a status code of 400 and error if failed to create user_group', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            username: 'Dev',
            id: req.userId
        });
        (UserGroup as any).findOne.mockResolvedValueOnce(false);
        (Group as any).create.mockResolvedValueOnce(true);
        (UserGroup as any).create.mockResolvedValueOnce(false);

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

        (User as any).findOne.mockResolvedValue(true);
        // Mock UserGroup.findOne to throw an error
        (UserGroup as any).findOne.mockRejectedValue(new Error("Unexpected error"));

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Unexpected error occured with error: Error: Unexpected error" });
    });
});

describe('On vaild user_group input', (): void => {
    it('should return a status code of 200 and confirmation message if user_group was created with no invites', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            username: 'Dev',
            id: req.userId
        });
        (UserGroup as any).findOne.mockResolvedValueOnce(false);
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

    it('should return a status code of 200 and message if invited users are already in a group', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER,
                invitedUsers: {
                    id: Number.MAX_SAFE_INTEGER
                }
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            username: 'Dev',
            id: req.userId
        });
        (UserGroup as any).findOne.mockResolvedValueOnce(false);
        (UserGroup as any).findOne.mockResolvedValueOnce(true);
        (User as any).findOne.mockResolvedValueOnce({
            username: "DevsFriend"
        });

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Users already in group", users: ["DevsFriend"] });

    });

    it('should return a status code of 200 and success message if group created with invites', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Capstone",
                userId: Number.MAX_SAFE_INTEGER,
                invitedUsers: {
                    id: Number.MAX_SAFE_INTEGER
                }
            }
        };

        (User as any).findOne.mockResolvedValueOnce({
            username: 'Dev',
            id: req.userId
        });
        (UserGroup as any).findOne.mockResolvedValueOnce(false);
        (UserGroup as any).findOne.mockResolvedValue(false);
        (Group as any).create.mockResolvedValueOnce(true);
        (UserGroup as any).create.mockResolvedValueOnce({
            userId: Number.MAX_SAFE_INTEGER,
            groupId: Number.MAX_SAFE_INTEGER,
            role: "Owner"
        });
        (Invitation as any).create.mockResolvedValue(true);

        await createUserGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Group creation and invitation creation successful", groupId: Number.MAX_SAFE_INTEGER });
    });

});


//UserGroup invitation test case
describe('On invaild user_group invitation input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if user_group has missing ownerId', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                ownerId: "",
                invitedUsers: {
                    id: Number.MAX_SAFE_INTEGER
                }
            }
        };

        await inviteMember(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to invite user to group, missing field: ownerId" });
    });

    it('should return a status code of 400 and error if user_group has missing groupId', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: "",
                ownerId: Number.MAX_SAFE_INTEGER,
                invitedUsers: {
                    id: Number.MAX_SAFE_INTEGER
                }
            }
        };

        await inviteMember(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to invite user to group, missing field: groupId" });
    });

    it('should return a status code of 400 and error if invited members have already been invited to group', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                ownerId: Number.MAX_SAFE_INTEGER,
                invitedUsers: {
                    id: Number.MAX_SAFE_INTEGER
                }
            }
        };

        (UserGroup as any).findOne.mockResolvedValue(false);
        (Invitation as any).findOne.mockResolvedValue(true);//Mock when each user has a pre-existing invite to group

        await inviteMember(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invitation has already been sent to users" });
    });
});

describe('On vaild user_group invitation input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and message if no user was invited', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                ownerId: Number.MAX_SAFE_INTEGER,
                invitedUsers: {}
            }
        };

        await inviteMember(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "No users indicated to invite" });
    });

    it('should return a status code of 200 and message if some invited users are in a group', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                ownerId: Number.MAX_SAFE_INTEGER,
                invitedUsers: {
                    id: Number.MAX_SAFE_INTEGER
                }
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(true);
        (User as any).findOne.mockResolvedValueOnce({
            username: "DevsFriend"
        })

        await inviteMember(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Users already in group`, users: ["DevsFriend"] });
    });

    it('should return a status code of 200 and success message if invites were sent succesfully', async (): Promise<void> => {
        const req: any = {
            body: {
                groupId: Number.MAX_SAFE_INTEGER,
                ownerId: Number.MAX_SAFE_INTEGER,
                invitedUsers: {
                    id: Number.MAX_SAFE_INTEGER,
                }
            }
        };

        (UserGroup as any).findOne.mockResolvedValue(false);
        (Invitation as any).findOne.mockResolvedValue(false);
        (Invitation as any).create.mockResolvedValue(true);

        await inviteMember(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Invitation sent successfully" });
    });
});

//UserGroup get all party members test
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

//UserGroup test delete party methods
describe('On invaild delete party input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error message if groupid is missing in the request', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: null,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: groupId" });
    });

    it('should return a status code of 400 and error message if userId is missing in the request', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: null
            }
        };

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: userId" });
    });

    it('should return a status code of 400 and error message if the group or user does not exist', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(false);

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User or group does not exist" });
    });

    it('should return a status code of 400 and error message if the user is not the owner', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "member"
        });

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not the owner" });
    });


    it('should return a status code of 400 and error message if the party couldnt be deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "Owner"
        });
        (Invitation as any).destroy.mockResolvedValue(true);
        (UserGroup as any).destroy.mockResolvedValueOnce(false);
        (Group as any).destroy.mockResolvedValueOnce(true);

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Party is unabled to be destroyed at this moment" });
    });

    it('should return a status code of 400 and error message if the group couldnt be deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "Owner"
        });
        (Invitation as any).destroy.mockResolvedValue(true);
        (UserGroup as any).destroy.mockResolvedValueOnce(true);
        (Group as any).destroy.mockResolvedValueOnce(false);

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
                groupId: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "Owner"
        });
        (Invitation as any).destroy.mockResolvedValue(true);
        (UserGroup as any).destroy.mockResolvedValueOnce(true);
        (Group as any).destroy.mockResolvedValueOnce(true);

        await deleteParty(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Successfully deleted party" });
    });
});

//UserGroup test delete members methods
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

        await leaveParty(req, res);
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

        await leaveParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: groupId" });
    });

    it('should return a status code of 400 and error message if owner tries to leave', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER - 1,
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "Owner"
        });

        await leaveParty(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Cannot leave party as the owner please delete party" });
    });

    it('should return a status code of 400 and error message if member was not deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER,
                groupId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            role: "member"
        });

        (UserGroup as any).destroy.mockResolvedValueOnce(false);

        await leaveParty(req, res);
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
            role: "member"
        });
        (UserGroup as any).destroy.mockResolvedValueOnce(true);

        await leaveParty(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Successfully removed member" });
    });
});

//UserGroup test getGroupInformation method
describe('On invaild get user party', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and if userId is not provided', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: null
            }
        };

        await getGroupInformation(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: userId" });
    });

    it('should return a status code of 400 and if not group information is found for user', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce(false);

        await getGroupInformation(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User is not in group" });
    });
});

describe('On vaild get user party', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and groupId if user is in group', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (UserGroup as any).findOne.mockResolvedValueOnce({
            groupId: Number.MAX_SAFE_INTEGER,
            role: "Owner"
        });
        (Group as any).findOne.mockResolvedValueOnce({
            name: "Dev Group Name"
        });

        await getGroupInformation(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "User is in group", groupId: Number.MAX_SAFE_INTEGER, role: "Owner", name: "Dev Group Name" });
    });
});