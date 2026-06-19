import { Router } from "express";
import { AuthController } from "./auth.controller";
import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated";
import rateLimit from "express-rate-limit";

const authRoutes = Router();

const authController = new AuthController();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, message: "Muitas tentativas de login. Tente novamente em alguns minutos." },
});

authRoutes.post("/login", loginLimiter, (request, response, next) => {
  return authController.login(request, response, next);
});

authRoutes.get("/me", ensureAuthenticated, (request, response, next) => {
  return authController.me(request, response, next);
});

authRoutes.get("/csrf-token", (request, response, next) => {
  return authController.csrfToken(request, response, next);
});

authRoutes.post("/logout", (request, response) => {
  // Clear cookie if present
  response.clearCookie("igreja_token", { httpOnly: true, sameSite: "strict" });
  response.clearCookie("igreja_csrf", { sameSite: "strict" });
  return response
    .status(200)
    .json({ success: true, message: "Logout realizado." });
});

authRoutes.patch(
  "/change-password",
  ensureAuthenticated,
  (request, response, next) => {
    return authController.changePassword(request, response, next);
  },
);

authRoutes.patch("/profile", ensureAuthenticated, (request, response, next) => {
  return authController.updateProfile(request, response, next);
});

export { authRoutes };
