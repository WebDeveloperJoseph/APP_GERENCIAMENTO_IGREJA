import {response, Router} from "express";
import { AuthController } from "./auth.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";

const authRoutes = Router();

const authController = new AuthController();

authRoutes.post("/login",(request, response, next) => {
    return authController.login(request, response, next);
});

authRoutes.get("/me", ensureAuthenticated, (request, response, next) => {
    return authController.me(request, response, next);
});

authRoutes.patch(
    "/change-password",
    ensureAuthenticated,
    (request, response, next) => {
        return authController.changePassword(request, response, next);
    }
);

export { authRoutes };