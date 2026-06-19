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

ownerRoutes.get("/members", (request, response, next) => {
  return ownerController.members(request, response, next);
});

ownerRoutes.get("/subscriptions", (request, response, next) => {
  return ownerController.subscriptions(request, response, next);
});

ownerRoutes.get("/transactions", (request, response, next) => {
  return ownerController.transactions(request, response, next);
});

ownerRoutes.post("/churches", (request, response, next) => {
  return ownerController.createChurch(request, response, next);
});

export { ownerRoutes };
