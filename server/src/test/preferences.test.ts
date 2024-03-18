import Preferences from "../models/Preferences";
import User from "../models/Users";
import { setLocationShare, setVisitedShare, setTimerSetting, getPreferences } from "../controllers/Preferences";

// Mock Preferences.create
jest.mock('../models/Preferences', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
}));

// Mock User.create
jest.mock('../models/Users', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
}));

const res: any = {
    /*Due to the return type, we have to return the status as a json object containing the HTTPS status and the response()*/
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
}

/* setLocationShare test case */
describe('On invaild setLocationShare', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it("should return a status code of 400 and error if userId is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: null,
                shareLocation: true
            }
        };
        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change location share, missing field: userId" });
    });

    it("should return a status code of 400 and error if shareLocation is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareLocation: null
            }
        };
        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change location share, missing field: shareLocation" });
    });


    it("should return a status code of 400 and error if shareLocation is not a boolean", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareLocation: "test"
            }
        };
        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change location share, 'shareLocation' must be a boolean" });
    });
});
