import { Router } from "express";
import { ReportsController } from "./reports.controller";

const reportsRoutes = Router();

const reportsController = new ReportsController();

reportsRoutes.get("/summary", (request, response, next) => {
    return reportsController.summary(request, response, next);
});

export { reportsRoutes };
