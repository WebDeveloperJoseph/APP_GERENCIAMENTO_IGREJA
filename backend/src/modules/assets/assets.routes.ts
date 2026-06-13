import { Router } from "express";

import { ensureRole } from "../../middlewares/ensureRole";
import { AssetsController } from "./assets.controller";

const assetsRoutes = Router();
const assetsController = new AssetsController();

assetsRoutes.get(
  "/",
  (request, response, next) => {
    return assetsController.list(request, response, next);
  },
);

assetsRoutes.get(
  "/:id",
  (request, response, next) => {
    return assetsController.show(request, response, next);
  },
);

assetsRoutes.post(
  "/",
  ensureRole(["DIRETOR_PATRIMONIO"]),
  (request, response, next) => {
    return assetsController.create(request, response, next);
  },
);

assetsRoutes.put(
  "/:id",
  ensureRole(["DIRETOR_PATRIMONIO"]),
  (request, response, next) => {
    return assetsController.update(request, response, next);
  },
);

assetsRoutes.delete(
  "/:id",
  ensureRole(["DIRETOR_PATRIMONIO"]),
  (request, response, next) => {
    return assetsController.delete(request, response, next);
  },
);

export { assetsRoutes };
