import { NextFunction, Request, Response } from "express";

import { AppError } from "../../errors/AppError";
import { OwnerService } from "./owner.service";

function ensureSuperAdmin(request: Request) {
  if (!request.member?.isSuperAdmin) {
    throw new AppError("Acesso permitido apenas ao dono da plataforma.", 403);
  }
}

class OwnerController {
  async dashboard(request: Request, response: Response, next: NextFunction) {
    try {
      ensureSuperAdmin(request);

      const ownerService = new OwnerService();
      const dashboard = await ownerService.dashboard();

      return response.status(200).json({
        success: true,
        message: "Resumo owner gerado com sucesso.",
        data: dashboard,
      });
    } catch (error) {
      return next(error);
    }
  }

  async churches(request: Request, response: Response, next: NextFunction) {
    try {
      ensureSuperAdmin(request);

      const ownerService = new OwnerService();
      const churches = await ownerService.churches();

      return response.status(200).json({
        success: true,
        message: "Igrejas listadas com sucesso.",
        data: churches,
      });
    } catch (error) {
      return next(error);
    }
  }

  async members(request: Request, response: Response, next: NextFunction) {
    try {
      ensureSuperAdmin(request);

      const ownerService = new OwnerService();
      const members = await ownerService.members();

      return response.status(200).json({
        success: true,
        message: "Membros listados com sucesso.",
        data: members,
      });
    } catch (error) {
      return next(error);
    }
  }

  async subscriptions(request: Request, response: Response, next: NextFunction) {
    try {
      ensureSuperAdmin(request);
      const data = await new OwnerService().subscriptions();
      return response.status(200).json({
        success: true,
        message: "Assinaturas listadas com sucesso.",
        data,
      });
    } catch (error) {
      return next(error);
    }
  }

  async transactions(request: Request, response: Response, next: NextFunction) {
    try {
      ensureSuperAdmin(request);

      const ownerService = new OwnerService();
      const transactions = await ownerService.transactions();

      return response.status(200).json({
        success: true,
        message: "Transações listadas com sucesso.",
        data: transactions,
      });
    } catch (error) {
      return next(error);
    }
  }

  async createChurch(request: Request, response: Response, next: NextFunction) {
    try {
      ensureSuperAdmin(request);

      const ownerService = new OwnerService();
      const created = await ownerService.createChurch(request.body);

      return response.status(201).json({
        success: true,
        message: "Igreja criada com sucesso.",
        data: created,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { OwnerController };
