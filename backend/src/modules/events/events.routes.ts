import { Router } from "express";

import { ensureRole } from "../../middlewares/ensureRole";
import { EventsController } from "./events.controller";

const eventsRoutes = Router();
const eventsController = new EventsController();

eventsRoutes.get("/", (request, response, next) => {
  return eventsController.list(request, response, next);
});

eventsRoutes.get("/:id", (request, response, next) => {
  return eventsController.show(request, response, next);
});

eventsRoutes.post(
  "/",
  ensureRole(["ADMIN"]),
  (request, response, next) => {
    return eventsController.create(request, response, next);
  },
);

eventsRoutes.put(
  "/:id",
  ensureRole(["ADMIN"]),
  (request, response, next) => {
    return eventsController.update(request, response, next);
  },
);

eventsRoutes.delete(
  "/:id",
  ensureRole(["ADMIN"]),
  (request, response, next) => {
    return eventsController.delete(request, response, next);
  },
);

export { eventsRoutes };
