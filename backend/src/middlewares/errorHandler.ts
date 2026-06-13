import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import multer from "multer";
import { logger } from "../utils/logger";

function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (error instanceof AppError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
            logger.warn("authentication_error", {
                path: request.originalUrl,
                method: request.method,
                statusCode: error.statusCode
            });
        }

        if (error.statusCode >= 500) {
            logger.error("unexpected_error", {
                path: request.originalUrl,
                method: request.method,
                message: error.message
            });
        }

        return response.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    if (error instanceof multer.MulterError) {
        return response.status(400).json({
            success: false,
            message:
                error.code === "LIMIT_FILE_SIZE"
                    ? "A imagem deve ter no maximo 5 MB."
                    : "Nao foi possivel enviar a imagem."
        });
    }

    const errorWithCode = error as Error & { code?: string };
    const isDatabaseError =
        error.name.includes("Prisma") ||
        Boolean(errorWithCode.code?.startsWith("P"));

    logger.error(isDatabaseError ? "database_error" : "unexpected_error", {
        path: request.originalUrl,
        method: request.method,
        errorName: error.name,
        message: error.message,
        stack: error.stack
    });

    return response.status(500).json({
        success: false,
        message: "Erro interno do servidor."
    });
}

export { errorHandler };
