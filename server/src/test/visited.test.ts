import Visited from "../models/Visited";
import {getAllVisited, newVisited} from "../controllers/Visited"

//Create mock request
jest.mock('../models/Visited', (): any =>({
    create: jest.fn()
}));


const res: any = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
}

describe("On invalid submission of a visited bar", () => {
    it("should return error code 400 if there is a missing field", async (): Promise<void> => {
        const req: any = {
            body: {
                bar_name: "",
                address: "123 sesame st"
            }
        }

        await newVisited(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error: "Failed to add new entire missing field: bar_name"})
    })

    it("should return error code 400 if there is a missing field", async (): Promise<void> => {
        const req: any = {
            body: {
                bar_name: "Ur Mom's House",
                address: ""
            }
        }

        await newVisited(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error: "Failed to add new entire missing field: address"})
    })

    
})

describe('On valid submission of a bar', () => {
    it("should return code 200 if all the info is there", async (): Promise<void> => {
        const req: any = {
            body: {
                bar_name: "Ur Mom's House",
                address: "123 sesame st"
            }
        }

        await newVisited(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({success: "Sucesfully added to Visited Table!"})
    })
})

describe('On successful request for all visited bars', () => {
    it("should return status code 200 if request is succesful", async (): Promise<void> => {
        const req: any = null
        await getAllVisited(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    })
})  