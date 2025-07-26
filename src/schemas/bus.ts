import { z } from "zod";

export const searchBusSchema = z.object({
  from: z.string().min(1, "From is required"),
  to: z.string().min(1, "To is required"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Date must be a valid date string",
  }),
});

export const createBusSchema = z.object({
  name: z.string().min(1),
  busNumber: z.string().min(1),
  routeId: z.string().length(24, "Invalid route ID"), // MongoDB ObjectId
  from: z.string().min(1),
  to: z.string().min(1),
  departureTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
  arrivalTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  price: z.number().min(0),
  seatsAvailable: z.number().min(1),
});

export type CreateBusInput = z.infer<typeof createBusSchema>;
export type SearchBusInput = z.infer<typeof searchBusSchema>;
