import Favorites from "../models/Favorites";
import { addFavorite } from "../controllers/Favorites";

// Mock Favorites.create
jest.mock('../models/Favorites', (): any => ({
    create: jest.fn(),
    findOne: jest.fn()
}));

const res: any = {
    /*Due to the return type, we have to return the status as a json object containing the HTTPS status and the response()*/
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
}

/*Favorite creation test case*/
describe('On invaild favorite creation', () => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it("should return a status code of 400 and error if userId or barName is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: "",
                barName: "",
                address: "test",
                note: "test"
            }
        };
        await addFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to register missing fields" });
    });

    it("should return a status code of 400 and error if the bar is already in favorites", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: "1",
                barName: "The Number 1 Bar",
                address: "",
                note: ""
            }
        };
        
        // Mocking findOne to return an existing favorite
        (Favorites as any).findOne.mockResolvedValue(true);
        await addFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Bar already in favorites" })
    });
});

describe('On successful favorite creation', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and success message if the favorite is added successfully', async (): Promise<void> => {
        const req: any = {
            body: {
                userId: "1",
                barName: "Bar Example",
                address: "499 Capstone St",
                note: "Nice staff"
            }
        };
        
        // Mocking findOne to return no existing favorite
        (Favorites as any).findOne.mockResolvedValue(null);
        await addFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Bar added to favorites", userId: "1", barName: "Bar Example", address: "499 Capstone St", note: "Nice staff"});
    });
});