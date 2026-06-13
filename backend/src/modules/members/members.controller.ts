import { Request, Response, NextFunction } from "express";
import { MembersService } from "./members.service";
import { AppError } from "../../errors/AppError";

class MembersController {
  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const membersService = new MembersService();

      const members = await membersService.list();

      return response.status(200).json({
        success: true,
        message: "Membros listados com sucesso.",
        data: members
      });
    } catch (error) {
      return next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, email, password, phone, photoUrl, birthDate, role } = request.body;

      const membersService = new MembersService();

      const member = await membersService.create({
        name,
        email,
        password,
        phone,
        photoUrl,
        birthDate,
        role,
      });

      return response.status(201).json({
        success: true,
        message: "Membro criado com sucesso.",
        data: member
      });
    } catch (error) {
      return next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;

      if (typeof id != "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const membersService = new MembersService();

      const member = await membersService.show(id);

      return response.status(200).json({
        success: true,
        message: "Membro encontrado com sucesso.",
        data: member
      });
    } catch (error) {
      return next(error);
    }
  }

  async put(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      const { name, email, phone, photoUrl, birthDate, role } = request.body;

      if (typeof id != "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const membersService = new MembersService();

      const member = await membersService.put(
        {
          name,
          email,
          phone,
          photoUrl,
          birthDate,
          role,
        },
        id,
      );

      return response.status(200).json({
        success: true,
        message: "Membro atualizado com sucesso.",
        data: member
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      if (typeof id != "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const membersService = new MembersService();

      await membersService.delete(id);

      return response.status(200).json({
        success: true,
        message: "Membro inativado com sucesso.",
        data: null
      });
    } catch (error) {
      return next(error);
    }
  }

  async deletePermanently(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;

      if (typeof id !== "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }

      const membersService = new MembersService();

      await membersService.deletePermanently(id, request.member.id);

      return response.status(200).json({
        success: true,
        message: "Membro excluído permanentemente com sucesso.",
        data: null
      });
    } catch (error) {
      return next(error);
    }
  }

  async listInactive(request: Request, response: Response, next: NextFunction) {
    try {
      const membersService = new MembersService();

      const members = await membersService.listInactive();

      return response.status(200).json({
        success: true,
        message: "Membros inativos listados com sucesso.",
        data: members
      });
    } catch (error) {
      return next(error);
    }
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params;


      const membersService = new MembersService();

      if (typeof id != "string") {
        throw new AppError("Campo de ID obrigatório.", 400);
      }
      const member = await membersService.restore(id);

      return response.status(200).json({
        success: true,
        message: "Membro restaurado com sucesso.",
        data: member
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { MembersController };
