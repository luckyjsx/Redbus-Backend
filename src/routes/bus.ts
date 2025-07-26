import { createBusHandler, getBusesHandler } from "@src/controller/bus";
import validateRequest from "@src/middleware/validateRequest";
import { createBusSchema, searchBusSchema } from "@src/schemas/bus";
import express from "express";

const router = express.Router();

/**
 * @route GET /api/buses/search
 * @query from, to, date
 */
router.post("/", validateRequest(createBusSchema), createBusHandler);
router.get("/search", validateRequest(searchBusSchema, 'query'), getBusesHandler);

export default router;
