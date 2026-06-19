import { Router } from "express";
import { FinanceController } from "./finance.controller";
import { ensureRole } from "../../middlewares/ensureRole";

const financeRoutes = Router();

const financeController = new FinanceController();

financeRoutes.get("/", (request, response, next) => {
  return financeController.list(request, response, next);
});

financeRoutes.get("/:id", (request, response, next) => {
  return financeController.show(request, response, next);
});

financeRoutes.post(
  "/",
  ensureRole(["TESOUREIRO", "ADMIN"]),
  (request, response, next) => {
    return financeController.create(request, response, next);
  },
);

financeRoutes.delete(
  "/:id",
  ensureRole(["TESOUREIRO", "ADMIN"]),
  (request, response, next) => {
    return financeController.delete(request, response, next);
  },
);

financeRoutes.put(
  "/:id",
  ensureRole(["TESOUREIRO", "ADMIN"]),
  (request, response, next) => {
    return financeController.update(request, response, next);
  },
);

export { financeRoutes };
