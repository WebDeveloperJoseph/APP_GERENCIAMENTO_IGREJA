import { NextFunction, Request, Response } from "express";

import { NotificationsService } from "./notifications.service";

class NotificationsController {
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const { token, platform } = request.body;
      const notificationsService = new NotificationsService();

      await notificationsService.registerPushToken({
        memberId: request.member.id,
        token,
        platform,
      });

      return response.status(200).json({
        success: true,
        message: "Aparelho registrado para notificacoes.",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const { token } = request.body;
      const notificationsService = new NotificationsService();

      await notificationsService.removePushToken(request.member.id, token);

      return response.status(200).json({
        success: true,
        message: "Aparelho removido das notificacoes.",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { NotificationsController };
