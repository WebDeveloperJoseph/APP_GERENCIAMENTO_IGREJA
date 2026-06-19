import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";
import { AuthService } from "./auth.service";

class AuthController {
  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;

      const authService = new AuthService();

      const result = await authService.login({
        email,
        password,
      });

      // Optionally set HttpOnly cookie instead of returning token in body
      const useCookie = (process.env.USE_COOKIE_AUTH ?? "false") === "true";

      if (useCookie && result.token) {
        const csrfToken = randomBytes(32).toString("hex");

        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict" as const,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        const csrfCookieOptions = {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict" as const,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        response.cookie("igreja_token", result.token, cookieOptions);
        response.cookie("igreja_csrf", csrfToken, csrfCookieOptions);

        return response.status(200).json({
          success: true,
          message: "Login realizado com sucesso.",
          data: {
            member: result.member,
            csrfToken,
          },
        });
      }

      return response.status(200).json({
        success: true,
        message: "Login realizado com sucesso.",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async me(request: Request, response: Response, next: NextFunction) {
    try {
      const memberId = request.member.id;

      const authService = new AuthService();

      const member = await authService.me(memberId);

      return response.status(200).json({
        success: true,
        message: "Usuário autenticado encontrado com sucesso.",
        data: member,
      });
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const memberId = request.member.id;
      const { oldPassword, newPassword } = request.body;

      const authService = new AuthService();

      await authService.changePassword({
        memberId,
        oldPassword,
        newPassword,
      });

      return response.status(200).json({
        success: true,
        message: "Senha alterada com sucesso.",
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { name, email, phone, birthDate, photoUrl } = request.body;
      const authService = new AuthService();
      const member = await authService.updateProfile({
        memberId: request.member.id,
        name,
        email,
        phone,
        birthDate,
        photoUrl,
      });

      return response.status(200).json({
        success: true,
        message: "Perfil atualizado com sucesso.",
        data: member,
      });
    } catch (error) {
      return next(error);
    }
  }

  async csrfToken(_request: Request, response: Response, next: NextFunction) {
    try {
      const useCookie = (process.env.USE_COOKIE_AUTH ?? "false") === "true";

      if (!useCookie) {
        return response.status(200).json({
          success: true,
          message: "CSRF desativado para auth sem cookie.",
          data: { csrfToken: null },
        });
      }

      const csrfToken = randomBytes(32).toString("hex");

      response.cookie("igreja_csrf", csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return response.status(200).json({
        success: true,
        message: "CSRF token gerado.",
        data: { csrfToken },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { AuthController };
