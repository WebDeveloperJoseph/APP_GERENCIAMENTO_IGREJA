import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError"; // Ajuste o caminho do seu AppError se necessário

// 1. Estendendo a interface de Request do Express para que o TS reconheça o churchId globalmente
declare global {
  namespace Express {
    interface Request {
      userId: string;
      churchId: string;
      role: string;
      isSuperAdmin: boolean;
    }
  }
}

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string; // O ID do membro geralmente fica no 'subject'
  role: string;
  isSuperAdmin: boolean;
  churchId: string; // 🔑 O ID da igreja que injetamos no AuthService!
}

export function ensureTenant(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token JWT não fornecido.", 401);
  }

  // O header vem no formato: "Bearer <TOKEN>", vamos dividir pelo espaço
  const [, token] = authHeader.split(" ");

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET não configurado no servidor.", 500);
  }

  try {
    // Descriptografa e valida o token
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // 2. Injeta as propriedades do usuário logado direto no objeto 'req'
    req.userId = decoded.sub;
    req.churchId = decoded.churchId;
    req.role = decoded.role;
    req.isSuperAdmin = decoded.isSuperAdmin;

    // Se o token for válido e o churchId foi injetado, permite que a requisição prossiga
    return next();
  } catch (error) {
    throw new AppError("Token JWT inválido ou expirado.", 401);
  }
}
