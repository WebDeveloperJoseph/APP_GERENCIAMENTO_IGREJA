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
import { ensureTenant } from "../middlewares/ensureTenant";

const routes = Router();

routes.use("/auth", authRoutes);

// 🔑 1. Roda a autenticação para decodificar o Token JWT
routes.use(ensureAuthenticated);

// 🔬 DEBUGGER 1: Ver o que a autenticação injetou no 'request.user'
routes.use((request, response, next) => {
  console.log("\n=======================================================");
  console.log("🔬 [DEBUG 1 - PÓS AUTENTICAÇÃO]");
  console.log(`➡️ ROTA ACESSADA: ${request.method} ${request.originalUrl}`);
  console.log(
    "👤 CONTEÚDO DO request.user:",
    JSON.stringify(request.user, null, 2),
  );
  console.log("=======================================================\n");
  next();
});

// 🔑 2. Roda o Tenant (Que precisa do request.user para validar a igreja)
routes.use(ensureTenant);

// 🔬 DEBUGGER 2: Ver se o churchId sobreviveu após passar pelo Tenant
routes.use((request, response, next) => {
  console.log("\n=======================================================");
  console.log("🔬 [DEBUG 2 - PÓS TENANT]");
  console.log("⛪ ID DA IGREJA NO USER:", request.user?.churchId);
  console.log(
    "⛪ ID DA IGREJA DIRETO NO REQ (se houver):",
    (request as any).churchId,
  );
  console.log("=======================================================\n");
  next();
});

// Suas rotas normais abaixo
routes.use("/members", membersRoutes);
routes.use("/transactions", financeRoutes);
routes.use("/reports", reportsRoutes);
routes.use("/assets", assetsRoutes); // 👈 Nossa rota com problema
routes.use("/events", eventsRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/uploads", uploadRoutes);

export { routes };
