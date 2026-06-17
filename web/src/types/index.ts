export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};

export type DataSource = "api" | "mock";

export type ServiceResult<T> = {
  data: T;
  source: DataSource;
  error?: string;
};

export type Role =
  | "MEMBRO"
  | "VOLUNTARIO"
  | "TESOUREIRO"
  | "PASTOR"
  | "DIRETOR_PATRIMONIO"
  | "ADMIN";

export type Member = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  birthDate?: string | null;
  role: Role;
  isSuperAdmin?: boolean;
  isActive?: boolean;
  mustChangePassword?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  coverImageUrl?: string | null;
  startDate: string;
  endDate: string;
  isPublic?: boolean;
};

export type TransactionType = "ENTRADA" | "SAIDA";

export type Transaction = {
  id: string;
  type: TransactionType;
  category: string;
  value: number;
  date: string;
  description?: string | null;
  memberId?: string | null;
};

export type DashboardSummary = {
  totalMembers: number;
  activeVolunteers: number;
  upcomingEvents: number;
  monthlyIncome: number;
  pendingExpenses: number;
  monthlyBirthdays: number;
  source?: "api" | "mock";
};

export type ChurchLead = {
  churchName: string;
  cnpj?: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  membersCount: number;
  responsibleName: string;
  password: string;
};

export type OwnerChurch = {
  id: string;
  name: string;
  plan: "Básico" | "Padrão" | "Premium" | "Enterprise";
  status: "Ativa" | "Em teste" | "Atrasada";
  city: string;
  admin: string;
  renewalDate: string;
};
