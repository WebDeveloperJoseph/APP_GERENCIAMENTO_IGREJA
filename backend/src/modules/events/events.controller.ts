import { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";
import { EventsService } from "./events.service";

class EventsController {
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const { month, year } = request.query;
      const eventsService = new EventsService();

      const events = await eventsService.list({
        month: month !== undefined ? Number(month) : undefined,
        year: year !== undefined ? Number(year) : undefined,
      });

      return response.status(200).json({
        success: true,
        message: "Eventos listados com sucesso.",
        data: events,
      });
    } catch (error) {
      return next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      if (typeof id !== "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const eventsService = new EventsService();
      const event = await eventsService.show(id);

      return response.status(200).json({
        success: true,
        message: "Evento encontrado com sucesso.",
        data: event,
      });
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        title,
        description,
        location,
        coverImageUrl,
        startDate,
        endDate,
        isPublic,
      } = request.body;
      const eventsService = new EventsService();

      const event = await eventsService.create({
        title,
        description,
        location,
        coverImageUrl,
        startDate,
        endDate,
        isPublic,
        createdById: request.member.id,
      });

      return response.status(201).json({
        success: true,
        message: "Evento criado com sucesso.",
        data: event,
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

      const {
        title,
        description,
        location,
        coverImageUrl,
        startDate,
        endDate,
        isPublic,
      } = request.body;
      const eventsService = new EventsService();

      const event = await eventsService.update(id, {
        title,
        description,
        location,
        coverImageUrl,
        startDate,
        endDate,
        isPublic,
      });

      return response.status(200).json({
        success: true,
        message: "Evento atualizado com sucesso.",
        data: event,
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

      const eventsService = new EventsService();
      await eventsService.delete(id);

      return response.status(200).json({
        success: true,
        message: "Evento excluído com sucesso.",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { EventsController };
