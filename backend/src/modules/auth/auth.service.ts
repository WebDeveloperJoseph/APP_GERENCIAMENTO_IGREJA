import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

interface LoginDTO {
    email: string;
    password: string;
}

interface ChangePasswordDTO {
    memberId: string;
    oldPassword: string;
    newPassword: string;
}

interface UpdateProfileDTO {
    memberId: string;
    name: string;
    email: string;
    phone?: string;
}

class AuthService {
    async login({ email, password }: LoginDTO) {
        if (!email) {
            throw new AppError("O e-mail é obrigatório.", 400);
        }

        if (!password) {
            throw new AppError("A senha é obrigatória.", 400);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const member = await prisma.member.findUnique({
            where: {
                email: normalizedEmail
            }
        });

        if (!member) {
            throw new AppError("E-mail ou senha inválidos.", 401);
        }

        if (!member.isActive) {
            throw new AppError("Este usuario esta inativo. Procure a administracao.", 403);
        }

        if (!member.password) {
            throw new AppError("Este membro não possui acesso ao sistema.", 403);
        }

        const passwordMatch = await bcrypt.compare(password, member.password);

        if (!passwordMatch) {
            throw new AppError("E-mail ou senha inválidos.", 401);
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new AppError("JWT_SECRET não configurado.", 500);
        }

        const token = jwt.sign(
            {
                role: member.role,
                isSuperAdmin: member.isSuperAdmin
            },
            secret,
            {
                subject: member.id,
                expiresIn: "1d"
            }
        );

        return {
            member: {
                id: member.id,
                name: member.name,
                email: member.email,
                photoUrl: member.photoUrl,
                role: member.role,
                isSuperAdmin: member.isSuperAdmin,
                mustChangePassword: member.mustChangePassword
            },
            token
        };
    }
    async me(memberId: string) {
        const member = await prisma.member.findUnique({
            where: {
                id: memberId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                isSuperAdmin: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!member) {
            throw new AppError("Usuário autenticado não encontrado.", 404);
        }

        return member;
    }
    async changePassword({ memberId, oldPassword, newPassword }: ChangePasswordDTO) {
        if (!oldPassword) {
            throw new AppError("A senha atual é obrigatória.", 400);
        }

        if (!newPassword) {
            throw new AppError("A nova senha é obrigatória.", 400);
        }

        if (newPassword.length < 6) {
            throw new AppError("A nova senha deve ter pelo menos 6 caracteres.", 400);
        }

        const member = await prisma.member.findUnique({
            where: {
                id: memberId
            }
        });

        if (!member) {
            throw new AppError("Usuário não encontrado.", 404);
        }

        if (!member.password) {
            throw new AppError("Este usuário ainda não possui senha cadastrada.", 400);
        }

        const oldPasswordMatch = await bcrypt.compare(oldPassword, member.password);

        if (!oldPasswordMatch) {
            throw new AppError("Senha atual incorreta.", 401);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 8);

        await prisma.member.update({
            where: {
                id: memberId
            },
            data: {
                password: hashedNewPassword,
                mustChangePassword: false
            }
        });
    }

    async updateProfile({ memberId, name, email, phone }: UpdateProfileDTO) {
        const normalizedName = name?.trim();
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedName) {
            throw new AppError("O nome é obrigatório.", 400);
        }

        if (!normalizedEmail) {
            throw new AppError("O e-mail é obrigatório.", 400);
        }

        const emailOwner = await prisma.member.findFirst({
            where: {
                email: normalizedEmail,
                id: {
                    not: memberId
                }
            }
        });

        if (emailOwner) {
            throw new AppError("Este e-mail já está sendo usado.", 409);
        }

        return prisma.member.update({
            where: {
                id: memberId
            },
            data: {
                name: normalizedName,
                email: normalizedEmail,
                phone: phone?.trim() || null
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                isSuperAdmin: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
}

export { AuthService };
