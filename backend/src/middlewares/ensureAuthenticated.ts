import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";

interface TokenPayload {
    sub: string;
    role: string;
}

function ensureAuthenticated(
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

        request.member = {
            id: decoded.sub,
            role: decoded.role
        };

        return next();
    } catch {
        throw new AppError("Token inválido ou expirado.", 401);
    }
}

export { ensureAuthenticated };