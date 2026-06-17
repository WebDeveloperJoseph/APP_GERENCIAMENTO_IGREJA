import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureTenant } from "../middlewares/ensureTenant";
import { assetsRoutes } from "../modules/assets/assets.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { churchesRoutes } from "../modules/churches/churches.routes";
import { eventsRoutes } from "../modules/events/events.routes";
import { financeRoutes } from "../modules/finance/finance.routes";
import { membersRoutes } from "../modules/members/members.routes";
import { notificationsRoutes } from "../modules/notifications/notifications.routes";
import { ownerRoutes } from "../modules/owner/owner.routes";
import { reportsRoutes } from "../modules/reports/reports.routes";
import { uploadRoutes } from "../modules/uploads/upload.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/churches", churchesRoutes);

routes.use(ensureAuthenticated);
routes.use(ensureTenant);

routes.use("/members", membersRoutes);
routes.use("/transactions", financeRoutes);
routes.use("/reports", reportsRoutes);
routes.use("/assets", assetsRoutes);
routes.use("/events", eventsRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/uploads", uploadRoutes);
routes.use("/owner", ownerRoutes);

export { routes };
