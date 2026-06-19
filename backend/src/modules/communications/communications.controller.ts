import { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";
import { CommunicationsService } from "./communications.service";

class CommunicationsController {
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const service = new CommunicationsService();
      const notices = await service.list(request.member.churchId);

      return response.status(200).json({
        success: true,
        message: "Comunicados listados com sucesso.",
        data: notices,
      });
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { title, message, audience, channel, status } = request.body;

      const service = new CommunicationsService();
      const notice = await service.create({
        title,
        message,
        audience,
        channel,
        status,
        churchId: request.member.churchId,
        createdById: request.member.id,
      });

      return response.status(201).json({
        success: true,
        message: "Comunicado criado com sucesso.",
        data: notice,
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      if (typeof id !== "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const { title, message, audience, channel, status } = request.body;

      const service = new CommunicationsService();
      const notice = await service.update(id, request.member.churchId, {
        title,
        message,
        audience,
        channel,
        status,
      });

      return response.status(200).json({
        success: true,
        message: "Comunicado atualizado com sucesso.",
        data: notice,
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      if (typeof id !== "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const service = new CommunicationsService();
      await service.delete(id, request.member.churchId);

      return response.status(200).json({
        success: true,
        message: "Comunicado removido com sucesso.",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { CommunicationsController };
