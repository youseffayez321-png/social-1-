import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
    constructor(
        public message: any,
        public statusCode: number,
    ) {
        super(message);
    }
}
export const globalErrorHandling=(err: AppError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.statusCode||500).json({
            message: err.message,
            statusCode:err.statusCode,
            stack: err.stack,
        });
    }