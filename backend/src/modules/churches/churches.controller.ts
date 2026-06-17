import { NextFunction, Request, Response } from "express";

import { ChurchesService } from "./churches.service";

class ChurchesController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const churchesService = new ChurchesService();
      const result = await churchesService.create(request.body);

      return response.status(201).json({
        success: true,
        message: "Igreja cadastrada com sucesso.",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { ChurchesController };
