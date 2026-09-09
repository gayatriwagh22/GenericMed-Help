import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: { statusCode?: number; message?: string; code?: string }, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const errorMsg = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    error: errorMsg,
    code,
  });
};
