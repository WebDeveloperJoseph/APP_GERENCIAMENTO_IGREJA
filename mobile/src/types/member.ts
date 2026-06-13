export type MemberRole = "MEMBRO" | "VOLUNTARIO" | "TESOUREIRO" | "ADMIN";

export interface Member {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  birthDate: string | null;
  role: MemberRole;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRoleOption {
  label: string;
  value: MemberRole;
}

export const MEMBER_ROLE_OPTIONS: MemberRoleOption[] = [
  { label: "Membro", value: "MEMBRO" },
  { label: "Voluntário", value: "VOLUNTARIO" },
  { label: "Tesoureiro", value: "TESOUREIRO" },
  { label: "Administrador", value: "ADMIN" },
];
