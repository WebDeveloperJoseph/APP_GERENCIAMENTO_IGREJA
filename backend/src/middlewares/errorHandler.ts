import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import multer from "multer";

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

    if (error instanceof multer.MulterError) {
        return response.status(400).json({
            success: false,
            message:
                error.code === "LIMIT_FILE_SIZE"
                    ? "A imagem deve ter no maximo 5 MB."
                    : "Nao foi possivel enviar a imagem."
        });
    }

    console.error(error);

    return response.status(500).json({
        success: false,
        message: "Erro interno do servidor."
    });
}

export { errorHandler };
