import { Router } from "express";

import { ChurchesController } from "./churches.controller";

const churchesRoutes = Router();
const churchesController = new ChurchesController();

churchesRoutes.post("/", (request, response, next) => {
  return churchesController.create(request, response, next);
});

export { churchesRoutes };
