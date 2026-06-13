import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

type Role = "MEMBRO" | "VOLUNTARIO" | "TESOUREIRO" | "PASTOR" | "ADMIN";

function ensureRole(allowedRoles: Role[]) {
    return (request: Request, response: Response, next: NextFunction) => {
        const memberRole = request.member.role as Role;

        if (!allowedRoles.includes(memberRole)) {
            throw new AppError("Você não tem permissão para acessar este recurso.", 403);
        }

        return next();
    };
}

export { ensureRole };
