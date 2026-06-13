import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";
import bcrypt from "bcryptjs";

type Role = "MEMBRO" | "VOLUNTARIO" | "TESOUREIRO" | "ADMIN";

interface CreateMemberDTO {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    photoUrl?: string | null;
    birthDate?: string;
    role: Role;
}

class MembersService {
    async list() {
        const members = await prisma.member.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                isActive: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return members;
    }

    async show(id: string) {
        const member = await prisma.member.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!member) {
            throw new AppError("Membro não encontrado.", 404);
        }

        return member;
    }

    async create({ name, email,password, phone, photoUrl, birthDate, role }: CreateMemberDTO) {
        if (!name) {
            throw new AppError("O nome é obrigatório!", 400);
        }

        if (!email) {
            throw new AppError("O email é obrigatório!", 400);
        }

        const validRoles: Role[] = ["MEMBRO", "VOLUNTARIO", "TESOUREIRO", "ADMIN"];

        if (!validRoles.includes(role)) {
            throw new AppError("Cargo inválido!", 400);
        }

        const emailAlreadyExists = await prisma.member.findUnique({
            where: {
                email
            }
        });

        if (emailAlreadyExists) {
            throw new AppError("Este e-mail já está sendo usado por outro membro.", 409);
        }
        const hashedPassword = password ? await bcrypt.hash(password, 8) : null;


        const member = await prisma.member.create({
            data: {
                name,
                email,
                password: hashedPassword,
                mustChangePassword: Boolean(hashedPassword),
                phone,
                photoUrl: photoUrl?.trim() || null,
                role,
                birthDate: birthDate ? new Date(birthDate) : null
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });


        

        return member;
    }

    async put({ name, email, phone, photoUrl, birthDate, role }: CreateMemberDTO, id: string) {
        const memberExists = await prisma.member.findUnique({
            where: {
                id
            }
        });

        if (!memberExists) {
            throw new AppError("Membro não encontrado.", 404);
        }

        const member = await prisma.member.update({
            where: {
                id
            },
            data: {
                name,
                email,
                phone,
                photoUrl: photoUrl?.trim() || null,
                role,
                birthDate: birthDate ? new Date(birthDate) : null
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return member;
    }

    async delete(id: string) {
        const memberExists = await prisma.member.findUnique({
            where: {
                id
            }
        });

        if (!memberExists) {
            throw new AppError("Membro não encontrado!", 404);
        }

        await prisma.member.update({
            where: {
                id
            },
            data: {
                isActive: false
            }
        });
    }

    async deletePermanently(id: string, authenticatedMemberId: string) {
        if (id === authenticatedMemberId) {
            throw new AppError(
                "Não é possível excluir permanentemente o próprio usuário.",
                400
            );
        }

        const memberExists = await prisma.member.findUnique({
            where: {
                id
            }
        });

        if (!memberExists) {
            throw new AppError("Membro não encontrado.", 404);
        }

        await prisma.$transaction([
            prisma.transaction.updateMany({
                where: {
                    memberId: id
                },
                data: {
                    memberId: null
                }
            }),
            prisma.member.delete({
                where: {
                    id
                }
            })
        ]);
    }

    async listInactive() {
        const members = await prisma.member.findMany({
            where: {
                isActive: false
            },
            orderBy: {
                updatedAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                isActive: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return members;
    }
    async restore(id: string) {
        const memberExists = await prisma.member.findUnique({
            where: {
                id
            }
        });

        if (!memberExists) {
            throw new AppError("Membro não encontrado.", 404);
        }

        if (memberExists.isActive) {
            throw new AppError("Este membro já está ativo.", 400);
        }

        const member = await prisma.member.update({
            where: {
                id
            },
            data: {
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                photoUrl: true,
                birthDate: true,
                role: true,
                isActive: true,
                mustChangePassword: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return member;
    }
}

export { MembersService };
