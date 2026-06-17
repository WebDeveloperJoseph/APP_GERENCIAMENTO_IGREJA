import { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";
import { AssetsService } from "./assets.service";

class AssetsController {
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const assetsService = new AssetsService();
      const { search, status } = request.query;

      // 🔑 CORREÇÃO: Captura o ID da igreja direto da raiz da requisição (onde o ensureTenant injeta)
      const churchId =
        (request as any).churchId ||
        (request as any).church_id ||
        request.user?.churchId;

      if (!churchId) {
        throw new AppError("Igreja não identificada na requisição.", 401);
      }

      const assets = await assetsService.list({
        churchId, // 🔑 Força o filtro pela igreja correta
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

      // 🔑 CORREÇÃO: Captura o ID da igreja direto da raiz da requisição
      const churchId =
        (request as any).churchId ||
        (request as any).church_id ||
        request.user?.churchId;

      if (!churchId) {
        throw new AppError("Igreja não identificada na requisição.", 401);
      }

      if (typeof id !== "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const assetsService = new AssetsService();
      // 🔑 Passa o churchId para garantir que ele não veja o patrimônio de outra igreja
      const asset = await assetsService.show(id, churchId);

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
      // 🔑 CORREÇÃO: Captura o ID da igreja direto da raiz da requisição
      const churchId =
        (request as any).churchId ||
        (request as any).church_id ||
        request.user?.churchId;

      if (!churchId) {
        throw new AppError("Igreja não identificada na requisição.", 401);
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
      const asset = await assetsService.create({
        churchId, // 🔑 Vincula o patrimônio à igreja dona dele
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

      // 🔑 CORREÇÃO: Captura o ID da igreja direto da raiz da requisição
      const churchId =
        (request as any).churchId ||
        (request as any).church_id ||
        request.user?.churchId;

      if (typeof id !== "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      if (!churchId) {
        throw new AppError("Igreja não identificada na requisição.", 401);
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
      const asset = await assetsService.update(id, churchId, {
        churchId,
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

      // 🔑 CORREÇÃO: Captura o ID da igreja direto da raiz da requisição
      const churchId =
        (request as any).churchId ||
        (request as any).church_id ||
        request.user?.churchId;

      if (typeof id !== "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      if (!churchId) {
        throw new AppError("Igreja não identificada na requisição.", 401);
      }

      const assetsService = new AssetsService();
      await assetsService.delete(id, churchId);

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
