import { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";
import { AssetsService } from "./assets.service";

class AssetsController {
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const assetsService = new AssetsService();
      const { search, status } = request.query;

      const assets = await assetsService.list({
        search: search ? String(search) : undefined,
        status: status ? String(status) : undefined,
      });

      return response.status(200).json({
        success: true,
        message: "Bens patrimoniais listados com sucesso.",
        data: assets,
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

      const assetsService = new AssetsService();
      const asset = await assetsService.show(id);

      return response.status(200).json({
        success: true,
        message: "Bem patrimonial encontrado com sucesso.",
        data: asset,
      });
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const {
        name,
        imageUrl,
        description,
        category,
        value,
        acquisitionDate,
        location,
        status,
      } = request.body;

      const assetsService = new AssetsService();
      const asset = await assetsService.create({
        name,
        imageUrl,
        description,
        category,
        value,
        acquisitionDate,
        location,
        status: status || "ATIVO",
      });

      return response.status(201).json({
        success: true,
        message: "Bem patrimonial cadastrado com sucesso.",
        data: asset,
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
        name,
        imageUrl,
        description,
        category,
        value,
        acquisitionDate,
        location,
        status,
      } = request.body;

      const assetsService = new AssetsService();
      const asset = await assetsService.update(id, {
        name,
        imageUrl,
        description,
        category,
        value,
        acquisitionDate,
        location,
        status,
      });

      return response.status(200).json({
        success: true,
        message: "Bem patrimonial atualizado com sucesso.",
        data: asset,
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

      const assetsService = new AssetsService();
      await assetsService.delete(id);

      return response.status(200).json({
        success: true,
        message: "Bem patrimonial excluído com sucesso.",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { AssetsController };
