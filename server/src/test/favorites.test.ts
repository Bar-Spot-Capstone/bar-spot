import Favorites from "../models/Favorites";
import User from "../models/Users";
import { addFavorite, getFavorites, deleteFavorite, clearFavorites } from "../controllers/Favorites";

// Mock Favorites.create
jest.mock('../models/Favorites', (): any => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn()
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

/*Favorites get bar list test*/
describe('On invalid get favorites input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error if userId is missing from params', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: null
            }
        };
        await getFavorites(req, res);
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

        await getFavorites(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
});

describe('On valid get favorites input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 200 and list of all bars for the user', async (): Promise<void> => {
        const req: any = {
            params: {
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (User as any).findOne.mockResolvedValueOnce(true);
        (Favorites as any).findAll.mockResolvedValueOnce([
            {
                userId: Number.MIN_VALUE,
                barName: 'The Salty Dog',
                address: '123 Test Street',
                note: 'Excellent on tap selection'
                
            }
        ]);

        await getFavorites(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            "favorites": [
                {
                    "barName": "The Salty Dog",
                    "address": "123 Test Street",
                    "note":  "Excellent on tap selection"
                }
            ]
        });
    });
});

/*Favorites test delete favorite method*/
describe('On invaild delete favorite input', (): void => {
    beforeEach((): void => {
        jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
    });

    it('should return a status code of 400 and error message if id is missing', async (): Promise<void> => {
        const req: any = {
            params: {
                id: null,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        await deleteFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: id" });
    });

    it('should return a status code of 400 and error message if userId is missing', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER,
                userId: null
            }
        };

        await deleteFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Unable to read: userId" });
    });


    it('should return a status code of 400 and error message if favorite was not deleted', async (): Promise<void> => {
        const req: any = {
            params: {
                id: Number.MAX_SAFE_INTEGER,
                userId: Number.MAX_SAFE_INTEGER
            }
        };

        (Favorites as any).destroy.mockResolvedValueOnce(false);

        await deleteFavorite(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Error in deleting favorite, please try again" });
    });

});

// describe('On vaild delete party member input', (): void => {
//     beforeEach((): void => {
//         jest.clearAllMocks(); // Reset mocks before each test case to not corrupt results
//     });

//     it('should return a status code of 200 and success message bar was deleted', async (): Promise<void> => {
//         const req: any = {
//             params: {
//                 id: Number.MAX_SAFE_INTEGER,
//                 userId: Number.MAX_SAFE_INTEGER
//             }
//         };

//         (Favorites as any).destroy.mockResolvedValueOnce(true);

//         await deleteFavorite(req, res);
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toHaveBeenCalledWith({ success: "Successfully removed favorite" });
//     });
// });;