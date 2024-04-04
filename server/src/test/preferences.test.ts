import Preferences from "../models/Preferences";
import User from "../models/Users";
import { setLocationShare, setVisitedShare, setTimerSetting, getPreferences } from "../controllers/Preferences";

// Mock Preferences.findOne
jest.mock('../models/Preferences', (): any => ({
    findOne: jest.fn()
}));

// Mock User.findOne
jest.mock('../models/Users', (): any => ({
    findOne: jest.fn()
}));

const res: any = {
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

    it('should return a status code of 400 and error if user doesnt exist', async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareLocation: true
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);

        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return a status code of 400 and error if shareLocation is not a boolean", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareLocation: "test"
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);

        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change location share, 'shareLocation' must be a boolean" });
    });

    it("should return a status code of 400 and error if preferences entry not found for the user", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareLocation: true
            }
        };
    
        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce(false);
    
        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Preferences entry not found for the user" });
    });
});

describe('On succesful setLocationShare', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it("should return a status code of 200 and success message if the share location is the same", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareLocation: true
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce({ 
            shareLocation: true 
        });

        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Share Location is already set to true"});
    });

    it("should return a status code of 200 and success message if the the share location is changed", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareLocation: false
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce({ 
            shareLocation: true 
        });

        await setLocationShare(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Share Location changed to false"});
    });
});

/* setVisitedShare test case */
describe('On invaild setVisitedShare', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it("should return a status code of 400 and error if userId is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: null,
                shareVisitedBars: true
            }
        };

        await setVisitedShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change visited share, missing field: userId" });
    });

    it("should return a status code of 400 and error if shareVisitedBars is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareVisitedBars: null
            }
        };

        await setVisitedShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change visited share, missing field: shareVisitedBars" });
    });

    it('should return a status code of 400 and error if user doesnt exist', async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareVisitedBars: true
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);

        await setVisitedShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return a status code of 400 and error if shareVisitedBars is not a boolean", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareVisitedBars: "test"
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);

        await setVisitedShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change visited share, 'shareVisitedBars' must be a boolean" });
    });

    it("should return a status code of 400 and error if preferences entry not found for the user", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareVisitedBars: true
            }
        };
    
        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce(false);
    
        await setVisitedShare(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Preferences entry not found for the user" });
    });
});

describe('On succesful setVisitedShare', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it("should return a status code of 200 and success message if the share visited bars is the same", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareVisitedBars: true
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce({ 
            shareVisitedBars: true 
        });

        await setVisitedShare(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Share Visited Bars is already set to true"});
    });

    it("should return a status code of 200 and success message if the the share visited bars is changed", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                shareVisitedBars: false
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce({ 
            shareVisitedBars: true 
        });

        await setVisitedShare(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Share Visited Bars changed to false"});
    });
});

/* setTimerSetting test case */
describe('On invaild setTimerSetting', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it("should return a status code of 400 and error if userId is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: null,
                timerSetting: 60
            }
        };

        await setTimerSetting(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change timer setting, missing field: userId" });
    });

    it("should return a status code of 400 and error if timerSetting is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                timerSetting: null
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);

        await setTimerSetting(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change timer setting, missing field: timerSetting" });
    });

    it('should return a status code of 400 and error if user doesnt exist', async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                timerSetting: 60
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);

        await setTimerSetting(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return a status code of 400 and error if timerSetting is not a number between 1 and Max_Safe_Int", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                timerSetting: -5
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);

        await setTimerSetting(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to change timer setting, timerSetting must be a number between 1 and Max_Safe_Int" });
    });
});

describe('On succesful setTimerSetting', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it("should return a status code of 200 and success message if the timer setting is the same", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                timerSetting: 60
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce({ 
            timerSetting: 60 
        });

        await setTimerSetting(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Timer setting is already set to 60 minutes"});
    });

    it("should return a status code of 200 and success message if the the timer setting is changed", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                timerSetting: 45
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce({ 
            timerSetting: 60 
        });

        await setTimerSetting(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Timer setting changed to 45 minutes"});
    });
});

/* getPreferences test case */
describe('On invalid getPreferences', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });
    
    it('should return a status code of 400 and error if userId is missing from params', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: null
            }
        };

        await getPreferences(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No userId provided" });
    });

    it('should return a status code of 400 and error if user doesnt exist', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(false);

        await getPreferences(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return a status code of 400 and error if preferences entry not found for the user", async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };
    
        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce(false);
    
        await getPreferences(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Preferences entry not found for the user" });
    });
});

describe('On succesful getPreferences', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and list all attributes of preferences', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Preferences as any).findOne.mockResolvedValueOnce({
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                timerSetting: 10,
                shareLocation: true,
                shareVisitedBars: false
            });

        await getPreferences(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            "preferences": {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER,
                timerSetting: 10,
                shareLocation: true,
                shareVisitedBars: false
            }
        });
    });
});