import { timingSafeEqual } from "crypto";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { AsaasWebhookService } from "./asaas-webhook.service";

function tokensMatch(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export class AsaasWebhookController {
  async receive(request: Request, response: Response, next: NextFunction) {
    try {
      const expected = process.env.ASAAS_WEBHOOK_TOKEN?.trim();
      const received = request.headers["asaas-access-token"];
      if (!expected || typeof received !== "string" || !tokensMatch(received, expected)) {
        throw new AppError("Webhook não autorizado.", 401);
      }
      const result = await new AsaasWebhookService().receive(request.body);
      return response.status(200).json({ received: true, ...result });
    } catch (error) { return next(error); }
  }
}
