import { BusModel } from "@src/model/bus";
import { CreateBusInput, SearchBusInput } from "@src/schemas/bus";
import { searchBuses } from "@src/services/searchBuses";
import { Request, Response } from "express";

export async function getBusesHandler(req: Request<{}, {}, {}, SearchBusInput>, res: Response) {
  try {
    const { from, to, date } = req.query;

    const buses = await searchBuses({ from, to, date: new Date(date) });

    return res.status(200).json({
      success: true,
      data: buses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export async function createBusHandler(req: Request, res: Response) {
  try {
    const busData = req.body as CreateBusInput;

    const bus = await BusModel.create({
      ...busData,
      date: new Date(busData.date),
    });

    return res.status(201).json({
      success: true,
      data: bus,
    });
  } catch (error) {
    console.error("Error creating bus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create bus",
    });
  }
}
