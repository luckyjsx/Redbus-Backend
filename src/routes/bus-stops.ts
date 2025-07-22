// routes/busStopRoutes.ts
import express from 'express';
import validateRequest from '@src/middleware/validateRequest';
import { busStopSchema } from '@src/schemas/bus-stop.schema';
import { createBusStop, getAllBusStops, getBusStopById } from '@src/controller/bus-stops';

const router = express.Router();

// POST /api/bus-stops
router.post('/', validateRequest(busStopSchema),createBusStop);

// GET /api/bus-stops
router.get('/', getAllBusStops);

// GET /api/bus-stops/:id
router.get('/:id', getBusStopById);

export default router;
