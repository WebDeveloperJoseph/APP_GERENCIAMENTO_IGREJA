import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";

export function ensureTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.member?.churchId) {
    throw new AppError("Igreja nao identificada na requisicao.", 401);
  }

  req.userId = req.member.id;
  req.churchId = req.member.churchId;
  req.role = req.member.role;
  req.isSuperAdmin = req.member.isSuperAdmin;

  return next();
}
