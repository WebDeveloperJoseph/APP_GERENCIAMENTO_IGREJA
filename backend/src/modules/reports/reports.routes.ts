import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { ensureRole} from "../../middlewares/ensureRole";

const reportsRoutes = Router();

const reportsController = new ReportsController();

reportsRoutes.get("/summary", ensureRole(["ADMIN", "TESOUREIRO"]),(request, response, next) => {
    return reportsController.summary(request, response, next);
});

export { reportsRoutes };