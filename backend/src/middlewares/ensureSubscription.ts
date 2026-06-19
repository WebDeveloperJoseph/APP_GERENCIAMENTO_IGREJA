import { NextFunction, Request, Response } from "express";

import { prisma } from "../database";
import { AppError } from "../errors/AppError";

export async function ensureSubscription(request: Request, _response: Response, next: NextFunction) {
  if (request.member.isSuperAdmin) return next();

  const subscription = await prisma.subscription.findUnique({
    where: { churchId: request.member.churchId },
    select: { status: true, trialEndsAt: true },
  });

  if (!subscription) return next(new AppError("Igreja sem assinatura configurada.", 402));
  if (subscription.status === "CANCELED" || subscription.status === "PAUSED") {
    return next(new AppError("Assinatura inativa. Regularize o acesso para continuar.", 402));
  }
  if (subscription.status === "TRIALING" && subscription.trialEndsAt && subscription.trialEndsAt.getTime() < Date.now()) {
    return next(new AppError("O período de teste terminou. Escolha um plano para continuar.", 402));
  }

  return next();
}
