import Visited from "../models/Visited";
import { Request, Response } from "express";

const newVisited = async (req: Request, res: Response): Promise<Response> => {
  const { bar_name, address }: { bar_name: string; address: string } = req.body;

  var handleEmpty: string = "";
  handleEmpty = !bar_name ? "bar_name" : "" || !address ? "address" : "";
  if (handleEmpty) {
    res.status(400);
    return res.json({
      error: `Failed to add new entire missing field: ${handleEmpty}`,
    });
  }
  try {
    await Visited.create({
      bar_name: bar_name,
      address: address,
    });

    res.status(200);
    return res.json({ success: "Sucesfully added to Visited Table!" });
  } catch (error: any) {
    res.status(500);
    return res.json({
      error: `Failed to add visited bar with unexpected error: ${error}`,
    });
  }
};

const getAllVisited = async (req: Request, res: Response) => {
  try {

    const bars = await Visited.findAll({attributes: ["bar_name", "address", "id"]});
    res.status(200);
    return res.json(bars);

  } catch (error: any) {

    res.status(500);
    return res.json({
      error: `Failed to retrieve visited bars with unexpected error: ${error}`,
    });
  }
};

export { newVisited, getAllVisited };
