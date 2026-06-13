import { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";

class UploadController {
  async createImage(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      if (!request.file) {
        throw new AppError("Selecione uma imagem para enviar.", 400);
      }

      const imageUrl = `${request.protocol}://${request.get("host")}/uploads/images/${request.file.filename}`;

      return response.status(201).json({
        success: true,
        message: "Imagem enviada com sucesso.",
        data: {
          url: imageUrl,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { UploadController };
