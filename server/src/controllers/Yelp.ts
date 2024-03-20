import { Request, Response } from "express";
import 'dotenv/config'

const getPubs = async (req: Request, res: Response): Promise<void> => {
    /*Have to format res.status.json to avoid header error*/
    const lat: string = req.params.lat;
    const lon: string = req.params.lon;

    const missingField: string = !lat ? 'lat' : '' || !lon ? 'lon' : '';
    
    if (missingField) {
        res.status(400).json({ error: `Failed to fetch bars missing ${missingField}` });
        return;
    }

    try {
        const url: string = `https://api.yelp.com/v3/businesses/search?term=Pubs&latitude=${lat}&longitude=${lon}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.YELP_API_TOKEN}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            res.status(401).json({ error: 'Failed to fetch data from Yelp API' });
            return;
        }
        const data = await response.json();
        res.status(200).json({businesses: data.businesses});
        return
    } catch (error: any) {
        res.status(500).json({ error: `Failed to fetch pubs with unexpected error: ${error}` });
    };
};

export {
    getPubs
};