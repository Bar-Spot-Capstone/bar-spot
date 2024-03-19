import { getPubs } from "../controllers/Yelp";

/* Mock fetch function */
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            "businesses": [
                {
                    "id": "FmGF1B-Rpsjq1f5b56qMwg",
                    "alias": "molinari-delicatessen-san-francisco",
                    "name": "Molinari Delicatessen",
                    "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/CwWUZKM8T3QaSvvEMjI7pw/o.jpg",
                    "is_closed": false,
                    "url": "https://www.yelp.com/biz/molinari-delicatessen-san-francisco?adjust_creative=KmEoncUp5OnRvU5oNHoPyQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=KmEoncUp5OnRvU5oNHoPyQ",
                    "review_count": 1379,
                    "categories": [
                        {
                            "alias": "gourmet",
                            "title": "Specialty Food"
                        },
                        {
                            "alias": "delis",
                            "title": "Delis"
                        }
                    ],
                    "rating": 4.4,
                    "coordinates": {
                        "latitude": 37.79838,
                        "longitude": -122.40782
                    },
                    "transactions": [
                        "delivery",
                        "pickup"
                    ],
                    "price": "$$",
                    "location": {
                        "address1": "373 Columbus Ave",
                        "address2": "",
                        "address3": "",
                        "city": "San Francisco",
                        "zip_code": "94133",
                        "country": "US",
                        "state": "CA",
                        "display_address": [
                            "373 Columbus Ave",
                            "San Francisco, CA 94133"
                        ]
                    },
                    "phone": "+14154212337",
                    "display_phone": "(415) 421-2337",
                    "distance": 1465.2460213942109
                },
            ],
            "total": 1,
            "region": {
                "center": {
                    "longitude": -122.399972,
                    "latitude": 37.786882
                }
            }
        }),
        ok: true
    }),
) as jest.Mock;

const res: any = {
    status: jest.fn(() => res),
    json: jest.fn(),
};

describe("On invalid request to yelp api", () => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    it("should return error code 400 if lat is missing", async (): Promise<void> => {
        const req: any = {
            params: {
                lat: null,
                lon: "-34"
            }
        };

        await getPubs(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch bars missing lat" });
    });

    it("should return error code 400 if lon is missing", async (): Promise<void> => {
        const req: any = {
            params: {
                lat: "91",
                lon: null
            }
        };

        await getPubs(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch bars missing lon" });
    });

    it("should return error code 401 if response is not okay", async (): Promise<void> => {
        const req: any = {
            params: {
                lat: "40.768538",
                lon: "-73.964741"
            }
        };
        (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
            Promise.resolve({
                ok: false,
                json: jest.fn().mockResolvedValue({})
            } as unknown as Response) // Convert to unknown first, then to Response
        );
        await getPubs(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch data from Yelp API" });
    });

    it("should return error code 500 if API is down", async (): Promise<void> => {
        const req: any = {
            params: {
                lat: "40.768538",
                lon: "-73.964741"
            }
        };
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(Promise.reject("API is down"));
        await getPubs(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch pubs with unexpected error: API is down" });
    });
});

describe("On vaild request to yelp api", () => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    it("should return error code 200 if request was succesful", async (): Promise<void> => {
        const req: any = {
            params: {
                lat: "40.768538",
                lon: "-73.964741"
            }
        };
        
        await getPubs(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch bars missing lat" });
    });
});