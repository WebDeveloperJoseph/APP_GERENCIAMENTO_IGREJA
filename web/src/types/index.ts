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
  plan: string;
  status: "Ativa" | "Em teste" | "Atrasada" | "Pausada" | "Cancelada" | "Sem assinatura";
  city: string;
  admin: string;
  renewalDate: string | null;
};

export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "PAUSED" | "CANCELED";

export type OwnerSubscription = {
  id: string;
  status: SubscriptionStatus;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  church: { id: string; name: string; slug: string };
  plan: { id: string; name: string; code: string; priceCents: number };
};

export type OwnerSubscriptionsResult = {
  summary: Record<SubscriptionStatus, number> & { total: number; mrr: number };
  subscriptions: OwnerSubscription[];
};

export type BillingPlan = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  priceCents: number;
  billingInterval: "MONTHLY" | "YEARLY";
  maxMembers?: number | null;
};

export type BillingOverview = {
  gatewayConfigured: boolean;
  subscription: {
    id: string;
    status: SubscriptionStatus;
    trialEndsAt?: string | null;
    currentPeriodEnd?: string | null;
    plan: BillingPlan;
    invoices: Array<{
      id: string;
      status: string;
      valueCents: number;
      dueDate?: string | null;
      invoiceUrl?: string | null;
    }>;
  } | null;
  plans: BillingPlan[];
};

export type OwnerDashboard = {
  activeChurches: number;
  trialChurches: number;
  mrr: number;
  monthlyRevenue: number;
  churn: number;
  openTickets: number;
  membersCount: number;
  recentChurches: OwnerChurch[];
};

export type CommunicationStatus = "RASCUNHO" | "ENVIADO";

export type CommunicationNotice = {
  id: string;
  title: string;
  message: string;
  audience: string;
  channel: string;
  status: CommunicationStatus;
  createdById?: string | null;
  createdBy?: {
    id: string;
    name: string;
    email?: string | null;
    role?: Role;
  } | null;
  createdAt: string;
  updatedAt: string;
};
