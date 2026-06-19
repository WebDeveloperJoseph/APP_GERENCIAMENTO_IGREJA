import { Router } from "express";

import { ensureRole } from "../../middlewares/ensureRole";
import { CommunicationsController } from "./communications.controller";

const communicationsRoutes = Router();
const communicationsController = new CommunicationsController();

communicationsRoutes.get("/", (request, response, next) => {
  return communicationsController.list(request, response, next);
});

communicationsRoutes.post(
  "/",
  ensureRole(["ADMIN", "PASTOR"]),
  (request, response, next) => {
    return communicationsController.create(request, response, next);
  },
);

communicationsRoutes.put(
  "/:id",
  ensureRole(["ADMIN", "PASTOR"]),
  (request, response, next) => {
    return communicationsController.update(request, response, next);
  },
);

communicationsRoutes.delete(
  "/:id",
  ensureRole(["ADMIN", "PASTOR"]),
  (request, response, next) => {
    return communicationsController.delete(request, response, next);
  },
);

export { communicationsRoutes };
