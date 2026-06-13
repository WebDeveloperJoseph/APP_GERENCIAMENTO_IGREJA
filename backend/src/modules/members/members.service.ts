import bcrypt from "bcryptjs";

import { prisma } from "../../database";
import { AppError } from "../../errors/AppError";

type Role =
    | "MEMBRO"
    | "VOLUNTARIO"
    | "TESOUREIRO"
    | "PASTOR"
    | "DIRETOR_PATRIMONIO"
    | "ADMIN";

interface AuthenticatedMember {
    id: string;
    role: string;
    isSuperAdmin: boolean;
}

interface MemberInput {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    photoUrl?: string | null;
    birthDate?: string;
    role: Role;
}

const memberSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    photoUrl: true,
    birthDate: true,
    role: true,
    isSuperAdmin: true,
    isActive: true,
    mustChangePassword: true,
    createdAt: true,
    updatedAt: true
} as const;

const validRoles: Role[] = [
    "MEMBRO",
    "VOLUNTARIO",
    "TESOUREIRO",
    "PASTOR",
    "DIRETOR_PATRIMONIO",
    "ADMIN"
];

class MembersService {
    async list() {
        return prisma.member.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: "desc"
            },
            select: memberSelect
        });
    }

    async show(id: string) {
        const member = await prisma.member.findUnique({
            where: {
                id
            },
            select: memberSelect
        });

        if (!member) {
            throw new AppError("Membro não encontrado.", 404);
        }

        return member;
    }

    async create(input: MemberInput, authenticatedMember: AuthenticatedMember) {
        if (!authenticatedMember.isSuperAdmin) {
            throw new AppError(
                "Somente o administrador principal pode criar contas de acesso.",
                403
            );
        }

        const name = input.name?.trim();
        const email = input.email?.trim().toLowerCase();

        if (!name) {
            throw new AppError("O nome é obrigatório.", 400);
        }

        if (!email) {
            throw new AppError("O e-mail é obrigatório.", 400);
        }

        if (!validRoles.includes(input.role)) {
            throw new AppError("Cargo inválido.", 400);
        }

        if (!input.password || input.password.length < 6) {
            throw new AppError(
                "Informe uma senha temporária com pelo menos 6 caracteres.",
                400
            );
        }

        const emailAlreadyExists = await prisma.member.findUnique({
            where: {
                email
            }
        });

        if (emailAlreadyExists) {
            throw new AppError(
                "Este e-mail já está sendo usado por outro membro.",
                409
            );
        }

        return prisma.member.create({
            data: {
                name,
                email,
                password: await bcrypt.hash(input.password, 8),
                mustChangePassword: true,
                phone: input.phone?.trim() || null,
                photoUrl: input.photoUrl?.trim() || null,
                role: input.role,
                birthDate: input.birthDate ? new Date(input.birthDate) : null
            },
            select: memberSelect
        });
    }

    async put(
        input: MemberInput,
        id: string,
        authenticatedMember: AuthenticatedMember
    ) {
        if (!authenticatedMember.isSuperAdmin) {
            throw new AppError(
                "Somente o administrador principal pode alterar membros.",
                403
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

        if (memberExists.isSuperAdmin && id !== authenticatedMember.id) {
            throw new AppError(
                "A conta do administrador principal não pode ser alterada por outro usuário.",
                403
            );
        }

        const name = input.name?.trim();
        const email = input.email?.trim().toLowerCase();

        if (!name || !email) {
            throw new AppError("Nome e e-mail são obrigatórios.", 400);
        }

        const emailOwner = await prisma.member.findFirst({
            where: {
                email,
                id: {
                    not: id
                }
            }
        });

        if (emailOwner) {
            throw new AppError(
                "Este e-mail já está sendo usado por outro membro.",
                409
            );
        }

        if (input.password && input.password.length < 6) {
            throw new AppError(
                "A senha temporária deve ter pelo menos 6 caracteres.",
                400
            );
        }

        const canManageAccess = authenticatedMember.isSuperAdmin;
        const hashedPassword =
            canManageAccess && input.password
                ? await bcrypt.hash(input.password, 8)
                : undefined;

        return prisma.member.update({
            where: {
                id
            },
            data: {
                name,
                email,
                phone: input.phone?.trim() || null,
                photoUrl: input.photoUrl?.trim() || null,
                role: canManageAccess ? input.role : memberExists.role,
                password: hashedPassword,
                mustChangePassword: hashedPassword ? true : undefined,
                birthDate: input.birthDate ? new Date(input.birthDate) : null
            },
            select: memberSelect
        });
    }

    async delete(id: string, authenticatedMember: AuthenticatedMember) {
        if (!authenticatedMember.isSuperAdmin) {
            throw new AppError(
                "Somente o administrador principal pode inativar membros.",
                403
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

        if (memberExists.isSuperAdmin) {
            throw new AppError(
                "O administrador principal não pode ser inativado.",
                403
            );
        }

        if (id === authenticatedMember.id) {
            throw new AppError("Não é possível inativar a própria conta.", 400);
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

    async deletePermanently(id: string, authenticatedMember: AuthenticatedMember) {
        if (!authenticatedMember.isSuperAdmin) {
            throw new AppError(
                "Somente o administrador principal pode excluir contas permanentemente.",
                403
            );
        }

        if (id === authenticatedMember.id) {
            throw new AppError(
                "Não é possível excluir permanentemente a própria conta.",
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

        if (memberExists.isSuperAdmin) {
            throw new AppError(
                "O administrador principal não pode ser excluído.",
                403
            );
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
        return prisma.member.findMany({
            where: {
                isActive: false
            },
            orderBy: {
                updatedAt: "desc"
            },
            select: memberSelect
        });
    }

    async restore(id: string, authenticatedMember: AuthenticatedMember) {
        if (!authenticatedMember.isSuperAdmin) {
            throw new AppError(
                "Somente o administrador principal pode restaurar contas.",
                403
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

        if (memberExists.isActive) {
            throw new AppError("Este membro já está ativo.", 400);
        }

        return prisma.member.update({
            where: {
                id
            },
            data: {
                isActive: true
            },
            select: memberSelect
        });
    }
}

export { MembersService };
