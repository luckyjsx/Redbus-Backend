// middleware/validateSchema.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

function validateRequest(schema: ZodSchema, target: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: result.error.format(),
      });
      return;  // <-- make sure to return here
    }

    req[target] = result.data;
    next();
  };
}

export default validateRequest;

