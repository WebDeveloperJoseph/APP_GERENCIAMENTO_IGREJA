import { Router } from "express";

import { OwnerController } from "./owner.controller";

const ownerRoutes = Router();
const ownerController = new OwnerController();

ownerRoutes.get("/dashboard", (request, response, next) => {
  return ownerController.dashboard(request, response, next);
});

ownerRoutes.get("/churches", (request, response, next) => {
  return ownerController.churches(request, response, next);
});

export { ownerRoutes };
