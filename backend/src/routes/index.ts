// Importação do modulo para criar rotas modulares
import { Router } from "express";
import { membersRoutes } from "../modules/members/members.routes";
import { financeRoutes } from "../modules/finance/finance.routes";
import { reportsRoutes } from "../modules/reports/reports.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { assetsRoutes } from "../modules/assets/assets.routes";
import { eventsRoutes } from "../modules/events/events.routes";
import { uploadRoutes } from "../modules/uploads/upload.routes";
import { notificationsRoutes } from "../modules/notifications/notifications.routes";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

// Instância "copia" do module de rotas modulares
const routes = Router();

// Instancia com metodo http get para listar produtos/clientes etc
routes.get("/", (request, response) => {
  return response.json({
    message: "API da igreja rodando! 2.1",
  });
});

routes.use("/auth", authRoutes);

// Intancia
routes.use("/members", ensureAuthenticated, membersRoutes);

routes.use(
  "/transactions",
  ensureAuthenticated,
  financeRoutes,
);

routes.use(
  "/reports",
  ensureAuthenticated,
  reportsRoutes,
);

routes.use("/assets", ensureAuthenticated, assetsRoutes);
routes.use("/events", ensureAuthenticated, eventsRoutes);
routes.use("/notifications", ensureAuthenticated, notificationsRoutes);
routes.use("/uploads", uploadRoutes);

export { routes };
