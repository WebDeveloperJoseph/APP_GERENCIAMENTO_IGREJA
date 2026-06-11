import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({
        success: false,
        message: "Erro interno do servidor."
    });
}

export { errorHandler };