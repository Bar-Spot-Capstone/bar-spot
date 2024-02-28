import Favorites from "../models/Favorites";
import { addFavorite, deleteFavorite } from "../controllers/Favorites";

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

    it("should return a status code of 400 and error if barName is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
                barName: "",
                address: "test",
                note: "test"
            }
        };
        await addFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create favorite, missing field: barName" });
    });

    it("should return a status code of 400 and error if userId is missing", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: null,
                barName: "Test Bar",
                address: "test",
                note: "test"
            }
        };
        await addFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to create favorite, missing field: userId" });
    });

    it("should return a status code of 400 and error if the bar is already in favorites", async (): Promise<void> => {
        const req: any = {
            body: {
                userId: Number.MAX_SAFE_INTEGER,
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
                userId: Number.MAX_SAFE_INTEGER,
                barName: "Bar Example",
                address: "499 Capstone St",
                note: "Nice staff"
            }
        };

        // Mocking findOne to return no existing favorite
        (Favorites as any).findOne.mockResolvedValue(null);
        // Mocking create to indicate successful addition
        (Favorites as any).create.mockResolvedValue({ userId: Number.MAX_SAFE_INTEGER, barName: "Bar Example", address: "499 Capstone St", note: "Nice staff" });
        await addFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: "Bar added to favorites", userId: Number.MAX_SAFE_INTEGER, barName: "Bar Example", address: "499 Capstone St", note: "Nice staff" });
    });
});