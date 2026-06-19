import { NextFunction, Request, Response } from "express";
import { BillingService } from "./billing.service";

export class BillingController {
  async overview(request: Request, response: Response, next: NextFunction) {
    try {
      const data = await new BillingService().overview(request.member.churchId);
      return response.json({ success: true, data });
    } catch (error) { return next(error); }
  }

  async checkout(request: Request, response: Response, next: NextFunction) {
    try {
      const data = await new BillingService().createCheckout(request.member.churchId, request.body.planId);
      return response.status(201).json({ success: true, message: "Checkout criado com sucesso.", data });
    } catch (error) { return next(error); }
  }
}
