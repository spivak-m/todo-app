import type { ErrorRequestHandler } from "express";
import { z, ZodError } from "zod";

// Кастомный класс для ошибок с HTTP-статусом
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
  if(err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if(err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: z.treeifyError(err) });
    return;
  }

  console.error('[Unhandled error]', err);
  res.status(500).json({ error: 'Internal Server Error' })
};
