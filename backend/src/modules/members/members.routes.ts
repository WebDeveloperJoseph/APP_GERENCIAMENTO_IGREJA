import { Router } from "express";
import { MembersController } from "./members.controller";
import { ensureRole } from "../../middlewares/ensureRole";

const membersRoutes = Router();

const membersController = new MembersController();

membersRoutes.get(
    "/",
    ensureRole(["ADMIN", "TESOUREIRO", "VOLUNTARIO"]),
    (request, response, next) => {
        return membersController.list(request, response, next);
    }
);

membersRoutes.get(
    "/inactive",
    ensureRole(["ADMIN"]),
    (request, response, next) => {
        return membersController.listInactive(request, response, next);
    }
);

membersRoutes.get(
    "/:id",
    ensureRole(["ADMIN", "TESOUREIRO", "VOLUNTARIO"]),
    (request, response, next) => {
        return membersController.show(request, response, next);
    }
);

membersRoutes.post(
    "/",
    ensureRole(["ADMIN", "VOLUNTARIO"]),
    (request, response, next) => {
        return membersController.create(request, response, next);
    }
);

membersRoutes.put(
    "/:id",
    ensureRole(["ADMIN"]),
    (request, response, next) => {
        return membersController.put(request, response, next);
    }
);

membersRoutes.patch(
    "/:id/restore",
    ensureRole(["ADMIN"]),
    (request, response, next) => {
        return membersController.restore(request, response, next);
    }
);

membersRoutes.delete(
    "/:id/permanent",
    ensureRole(["ADMIN"]),
    (request, response, next) => {
        return membersController.deletePermanently(request, response, next);
    }
);

membersRoutes.delete(
    "/:id",
    ensureRole(["ADMIN"]),
    (request, response, next) => {
        return membersController.delete(request, response, next);
    }
);

export { membersRoutes };
