import Favorites from "../models/Favorites";
import { addFavorite } from "../controllers/Favorites";
import { UniqueConstraintError as SequelizeUniqueConstraintError } from 'sequelize';

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

    it("should return a status code of 400 and error if ")
});