import { NextFunction, Request, Response } from "express";
import { ReportsService } from "./reports.service";
import { AppError } from "../../errors/AppError";

class ReportsController {
  async summary(request: Request, response: Response, next: NextFunction) {
    try {
      const { month, year } = request.query;

      // 🔑 CORREÇÃO: Captura o ID da igreja direto da raiz da requisição (injetado pelo ensureTenant)
      const churchId =
        (request as any).churchId ||
        (request as any).church_id ||
        request.user?.churchId;

      if (!churchId) {
        throw new AppError("Igreja não identificada na requisição.", 401);
      }

      const reportsService = new ReportsService();

      const summary = await reportsService.summary({
        churchId, // 🔑 Envia o ID isolado para o Service filtrar
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
      });

      return response.status(200).json({
        success: true,
        message: "Resumo financeiro gerado com sucesso.",
        data: summary,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { ReportsController };
