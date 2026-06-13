import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

class AuthController {
    async login(request: Request, response: Response, next: NextFunction) {
        try {
            const { email, password } = request.body;

            const authService = new AuthService();

            const result = await authService.login({
                email,
                password
            });

            return response.status(200).json({
                success: true,
                message: "Login realizado com sucesso.",
                data: result
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
                data: member
            });
        } catch (error) {
            return next(error);
        }
    }

    async changePassword(request: Request, response: Response, next: NextFunction){
        try {
            const memberId = request.member.id;
            const { oldPassword, newPassword } = request.body;

            const authService = new AuthService();

            await authService.changePassword({
                memberId,
                oldPassword,
                newPassword
            });

            return response.status(200).json({
                success: true,
                message: "Senha alterada com sucesso.",
                data: null
            });
        } catch (error) {
            return next(error);
        }
    }
}

export { AuthController };
