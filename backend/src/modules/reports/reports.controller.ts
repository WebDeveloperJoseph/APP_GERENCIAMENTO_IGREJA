import {NextFunction, Request, Response} from "express";
import { ReportsService } from "./reports.service";

class ReportsController {
    async summary(request: Request, response: Response, next: NextFunction) {
        try {
            const { month, year } = request.query;

            const reportsService = new ReportsService();

            const summary = await reportsService.summary({
                month: month ? Number(month) : undefined,
                year: year ? Number(year) : undefined
            });

            return response.status(200).json({
                success: true,
                message: "Resumo financeiro gerado com sucesso.",
                data: summary
            });
        } catch (error) {
            return next(error)
        }
    }
}

export { ReportsController };