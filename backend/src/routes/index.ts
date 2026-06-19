import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureTenant } from "../middlewares/ensureTenant";
import { ensureSubscription } from "../middlewares/ensureSubscription";
import { assetsRoutes } from "../modules/assets/assets.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { churchesRoutes } from "../modules/churches/churches.routes";
import { communicationsRoutes } from "../modules/communications/communications.routes";
import { eventsRoutes } from "../modules/events/events.routes";
import { financeRoutes } from "../modules/finance/finance.routes";
import { membersRoutes } from "../modules/members/members.routes";
import { notificationsRoutes } from "../modules/notifications/notifications.routes";
import { ownerRoutes } from "../modules/owner/owner.routes";
import { reportsRoutes } from "../modules/reports/reports.routes";
import { uploadRoutes } from "../modules/uploads/upload.routes";
import { billingRoutes } from "../modules/billing/billing.routes";
import { asaasWebhookRoutes } from "../modules/billing/asaas-webhook.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/churches", churchesRoutes);
routes.use("/webhooks/asaas", asaasWebhookRoutes);

routes.use(ensureAuthenticated);

// Platform-owner routes are global by design and must not require a tenant.
routes.use("/owner", ownerRoutes);

// Every business route below is scoped to the authenticated church.
routes.use(ensureTenant);
routes.use("/billing", billingRoutes);
routes.use(ensureSubscription);

routes.use("/members", membersRoutes);
routes.use("/transactions", financeRoutes);
routes.use("/reports", reportsRoutes);
routes.use("/assets", assetsRoutes);
routes.use("/events", eventsRoutes);
routes.use("/communications", communicationsRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/uploads", uploadRoutes);

export { routes };
