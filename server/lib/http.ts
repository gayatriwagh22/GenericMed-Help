import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  constructor(public statusCode: number, public code: string, message: string) { super(message); }
}

export const asyncRoute = (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown) =>
  (req: Request, res: Response, next: NextFunction) => Promise.resolve(handler(req, res, next)).catch(next);

export const requiredString = (value: unknown, name: string) => {
  if (typeof value !== 'string' || !value.trim()) throw new ApiError(400, 'VALIDATION_ERROR', `${name} is required`);
  return value.trim();
};
