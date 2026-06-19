import { Router } from "express";
import { ensureRole } from "../../middlewares/ensureRole";
import { BillingController } from "./billing.controller";

const billingRoutes = Router();
const controller = new BillingController();
billingRoutes.get("/", (req, res, next) => controller.overview(req, res, next));
billingRoutes.post("/checkout", ensureRole(["ADMIN", "PASTOR"]), (req, res, next) => controller.checkout(req, res, next));

export { billingRoutes };
