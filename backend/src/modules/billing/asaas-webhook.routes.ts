import { Router } from "express";
import { AsaasWebhookController } from "./asaas-webhook.controller";

const asaasWebhookRoutes = Router();
const controller = new AsaasWebhookController();
asaasWebhookRoutes.post("/", (req, res, next) => controller.receive(req, res, next));

export { asaasWebhookRoutes };
