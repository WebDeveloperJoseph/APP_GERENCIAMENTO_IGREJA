import { Router} from "express";
import { FinanceController} from "./finance.controller";
import { ensureRole} from "../../middlewares/ensureRole";

const financeRoutes = Router();

const financeController = new FinanceController();

financeRoutes.get("/", ensureRole(["ADMIN", "TESOUREIRO"]),(request, response, next) => {
    return financeController.list(request, response, next)
});

financeRoutes.get("/:id",
    ensureRole(["ADMIN", "TESOUREIRO"]),(request, response, next) => {
    return financeController.show(request, response, next);
});

financeRoutes.post("/",ensureRole(["ADMIN", "TESOUREIRO"]) ,(request, response, next) => {
    return financeController.create(request, response, next)
});

financeRoutes.delete("/:id",
    ensureRole(["ADMIN"]),
    (request, response, next) => {
    return financeController.delete(request, response, next);
});

financeRoutes.put(
    "/:id",
    ensureRole(["ADMIN", "TESOUREIRO"]),
    (request, response, next) => {
        return financeController.update(request, response, next);
    }
);

export { financeRoutes };