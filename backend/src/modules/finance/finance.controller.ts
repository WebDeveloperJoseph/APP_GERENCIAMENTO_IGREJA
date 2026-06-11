import {Request, Response, NextFunction} from "express";
import { FinanceService} from "./finance.service"
import {AppError} from "../../errors/AppError";

class FinanceController {
    async list(request: Request, response: Response, next: NextFunction) {
        try {
            const { month, year, type, category, memberId} = request.query

            const financeService = new FinanceService();

            const transactions = await financeService.list({
                month: month ? Number(month) : undefined,
                year: year ? Number(year) : undefined,
                type: type ? String(type) : undefined,
                category: category ? String(category) : undefined,
                memberId: memberId ? String(memberId) : undefined
            });

            return response.status(200).json({
                success: true,
                message: "Movimentações financeiras listadas com sucesso.",
                data: transactions
            });

        } catch (error) {
           return  next(error)
        }
    }

    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const {
                type,
                category,
                value,
                description,
                memberId,
                date
            } = request.body;

            const financeService = new FinanceService();

            const transaction = await financeService.create({
                type,
                category,
                value,
                description,
                memberId,
                date
            });

            return response.status(201).json({
                success: true,
                message: "Movimentação financeira criada com sucesso.",
                data: transaction
            });
        } catch (error) {
            return next(error)
        }
    }

    async show(request: Request, response: Response, next: NextFunction){
        try {
            const { id } = request.params;

            const financeService = new FinanceService();

            if (typeof id != "string") {
                throw new AppError("Campo de ID obrigatório.", 400);
            }

            const transaction = await financeService.show(id);

            return response.status(200).json({
                success: true,
                message: "Movimentação financeira encontrada com sucesso.",
                data: transaction
            });
        }catch (error) {
            return next(error)
        }
    }

    async delete(request: Request, response: Response, next: NextFunction){
        try {
            const { id } = request.params;

            const financeService = new FinanceService();

            if (typeof id != "string") {
                throw new AppError("Campo de ID obrigatório.", 400);
            }

            await financeService.delete(id);

            return response.status(200).json({
                success: true,
                message: "Movimentação financeira excluída com sucesso.",
                data: null
            });

        }catch (error) {
            return next(error)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;

            const {
                type,
                category,
                value,
                description,
                memberId,
                date
            } = request.body;

            const financeService = new FinanceService();

            if (typeof id != "string") {
                throw new AppError("Campo de ID inválido.", 400);
            }

                const transaction = await financeService.update(id, {
                    type,
                    category,
                    value,
                    description,
                    memberId,
                    date
                });

            return response.status(200).json({
                success: true,
                message: "Movimentação financeira atualizada com sucesso.",
                data: transaction
            });
        } catch (error) {
            return next(error);
        }
    }
}

export { FinanceController };
