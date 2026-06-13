import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../database";
import { AppError } from "../errors/AppError";
import { logger } from "../utils/logger";

interface TokenPayload {
  sub: string;
}

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token nao informado.", 401);
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      throw new AppError("Token invalido.", 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT_SECRET nao configurado.", 500);
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    const member = await prisma.member.findUnique({
      where: {
        id: decoded.sub,
      },
      select: {
        id: true,
        role: true,
        isSuperAdmin: true,
        isActive: true,
      },
    });

    if (!member || !member.isActive) {
      throw new AppError("Usuario inativo ou nao encontrado.", 401);
    }

    request.member = member;
    return next();
  } catch (error) {
    logger.warn("authentication_error", {
      path: request.originalUrl,
      method: request.method,
      statusCode: error instanceof AppError ? error.statusCode : 401,
      reason: error instanceof Error ? error.name : "unknown",
    });

    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Token invalido ou expirado.", 401));
  }
}

export { ensureAuthenticated };
