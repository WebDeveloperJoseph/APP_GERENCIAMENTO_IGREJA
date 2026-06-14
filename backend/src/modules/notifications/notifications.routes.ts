import { Router } from "express";

import { NotificationsController } from "./notifications.controller";

const notificationsRoutes = Router();
const notificationsController = new NotificationsController();

notificationsRoutes.post("/register", (request, response, next) =>
  notificationsController.register(request, response, next),
);

notificationsRoutes.delete("/register", (request, response, next) =>
  notificationsController.remove(request, response, next),
);

export { notificationsRoutes };
