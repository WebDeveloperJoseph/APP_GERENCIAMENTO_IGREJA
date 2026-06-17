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
}

export { OwnerController };
