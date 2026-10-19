import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from 'zod'

type Source = 'body' | 'query' | 'params';

export const validate =
  <T>(schema: ZodType<T>, source: Source = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if(!result.success) {
      const flattened = z.flattenError(result.error);
      res.status(400).json({
        error: 'Validation failed',
        details: flattened,
      });
      return;
    }

    req[source] = result.data as any;
    next()
  }
