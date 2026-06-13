import { Router } from "express";

import { ensureRole } from "../../middlewares/ensureRole";
import { AssetsController } from "./assets.controller";

const assetsRoutes = Router();
const assetsController = new AssetsController();

assetsRoutes.get(
  "/",
  ensureRole(["ADMIN", "TESOUREIRO"]),
  (request, response, next) => {
    return assetsController.list(request, response, next);
  },
);

assetsRoutes.get(
  "/:id",
  ensureRole(["ADMIN", "TESOUREIRO"]),
  (request, response, next) => {
    return assetsController.show(request, response, next);
  },
);

assetsRoutes.post(
  "/",
  ensureRole(["ADMIN", "TESOUREIRO"]),
  (request, response, next) => {
    return assetsController.create(request, response, next);
  },
);

assetsRoutes.put(
  "/:id",
  ensureRole(["ADMIN", "TESOUREIRO"]),
  (request, response, next) => {
    return assetsController.update(request, response, next);
  },
);

assetsRoutes.delete(
  "/:id",
  ensureRole(["ADMIN"]),
  (request, response, next) => {
    return assetsController.delete(request, response, next);
  },
);

export { assetsRoutes };
