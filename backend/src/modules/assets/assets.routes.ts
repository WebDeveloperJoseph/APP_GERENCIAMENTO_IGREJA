import { Router } from "express";

import { ensureAuthenticated } from "../../middlewares/ensureAuthenticated"; // 🔑 IMPORTANTE: Importe o seu middleware de autenticação aqui
import { ensureRole } from "../../middlewares/ensureRole";
import { AssetsController } from "./assets.controller";

const assetsRoutes = Router();
const assetsController = new AssetsController();

// 🔑 1. Protege TODAS as rotas abaixo com autenticação JWT.
// Isso garante que o 'request.user' e o 'churchId' existam em qualquer requisição!
assetsRoutes.use(ensureAuthenticated);

// 📋 Rotas de Leitura (Qualquer usuário autenticado da igreja pode ver)
assetsRoutes.get("/", assetsController.list);
assetsRoutes.get("/:id", assetsController.show);

// 🔐 Rotas de Escrita (Apenas quem está autenticado E tem a role específica)
assetsRoutes.post(
  "/",
  ensureRole(["DIRETOR_PATRIMONIO"]),
  assetsController.create,
);
assetsRoutes.put(
  "/:id",
  ensureRole(["DIRETOR_PATRIMONIO"]),
  assetsController.update,
);
assetsRoutes.delete(
  "/:id",
  ensureRole(["DIRETOR_PATRIMONIO"]),
  assetsController.delete,
);

export { assetsRoutes };
