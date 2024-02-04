import Group from "../models/Group";
import { addGroup } from "../controllers/Group";

// Mock Group.create
jest.mock('../models/Group', (): any => ({
    create: jest.fn()
}));

const res: any = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
};

/*Group add test case*/
describe('On invaild user add', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if group has missing field in request', async (): Promise<void> => {
        const req: any = {
            body: {
                name: ""
            }
        };

        await addGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create group with error: No group name provided" });
    });

    it('should return a status code of 400 and error if failed to create group', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Beer Lovers"
            }
        };

        (Group as any).create.mockResolvedValue(false);

        await addGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create group" });
    });
});

describe('On vaild user add', (): any => {
    it('should return a status code of 200 and confirmation message if group was created', async (): Promise<void> => {
        const req: any = {
            body: {
                name: "Beer Lovers"
            }
        };

        (Group as any).create.mockResolvedValue(true);

        await addGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Group creation successful" });
    });
});