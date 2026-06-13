import { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";
import { prisma } from "../../database";

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

      const image = await prisma.storedImage.create({
        data: {
          mimeType: request.file.mimetype,
          data: Uint8Array.from(request.file.buffer),
        },
        select: {
          id: true,
        },
      });
      const imageUrl = `${request.protocol}://${request.get("host")}/uploads/images/${image.id}`;

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

  async showImage(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const image = await prisma.storedImage.findUnique({
        where: {
          id: String(request.params.id),
        },
      });

      if (!image) {
        throw new AppError("Imagem nao encontrada.", 404);
      }

      response.setHeader("Content-Type", image.mimeType);
      response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return response.send(Buffer.from(image.data));
    } catch (error) {
      return next(error);
    }
  }
}

export { UploadController };
