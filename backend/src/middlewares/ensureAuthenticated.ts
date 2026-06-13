import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../database";
import { AppError } from "../errors/AppError";

interface TokenPayload {
    sub: string;
}

async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token não informado.", 401);
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
        throw new AppError("Token inválido.", 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new AppError("JWT_SECRET não configurado.", 500);
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;
        const member = await prisma.member.findUnique({
            where: {
                id: decoded.sub
            },
            select: {
                id: true,
                role: true,
                isSuperAdmin: true,
                isActive: true
            }
        });

        if (!member || !member.isActive) {
            throw new AppError("Usuário inativo ou não encontrado.", 401);
        }

        request.member = member;
        return next();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError("Token inválido ou expirado.", 401);
    }
}

export { ensureAuthenticated };
