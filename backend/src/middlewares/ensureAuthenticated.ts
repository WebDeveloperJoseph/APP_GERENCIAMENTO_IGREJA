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
    // Support token via Authorization header or HttpOnly cookie 'igreja_token'
    const authHeader = request.headers.authorization;
    let token: string | undefined;

    if (authHeader) {
      const parts = authHeader.split(" ");
      token = parts[1];
    }

    if (!token) {
      // parse cookie header if present
      const cookieHeader = request.headers.cookie;
      if (cookieHeader) {
        const match = cookieHeader.match(/(?:^|; )igreja_token=([^;]+)/);
        if (match) token = decodeURIComponent(match[1]);
      }
    }

    if (!token) {
      throw new AppError("Token nao informado.", 401);
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
        churchId: true, // 🔑 Adicionado ao contrato do usuário autenticado
      },
    });

    if (!member || !member.isActive) {
      throw new AppError("Usuario inativo ou nao encontrado.", 401);
    }

    if (!member.churchId && !member.isSuperAdmin) {
      throw new AppError("Usuario sem igreja vinculada.", 401);
    }

    const authenticatedMember = {
      id: member.id,
      role: member.role,
      isSuperAdmin: member.isSuperAdmin,
      churchId: member.churchId ?? "",
    };

    request.member = authenticatedMember;
    request.user = authenticatedMember;
    request.userId = authenticatedMember.id;
    if (authenticatedMember.churchId) {
      request.churchId = authenticatedMember.churchId;
    }
    request.role = authenticatedMember.role;
    request.isSuperAdmin = authenticatedMember.isSuperAdmin;

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
