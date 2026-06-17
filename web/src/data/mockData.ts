import type {
  DashboardSummary,
  EventItem,
  Member,
  OwnerChurch,
  Transaction,
} from "@/types";

export const mockMembers: Member[] = [
  {
    id: "1",
    name: "Ana Clara Souza",
    email: "ana.clara@igreja.com.br",
    phone: "(11) 98765-4321",
    birthDate: "1990-05-15T00:00:00.000Z",
    role: "VOLUNTARIO",
    isActive: true,
  },
  {
    id: "2",
    name: "Bruno Farias",
    email: "bruno.farias@igreja.com.br",
    phone: "(11) 91234-8899",
    birthDate: "1985-05-08T00:00:00.000Z",
    role: "PASTOR",
    isActive: true,
  },
  {
    id: "3",
    name: "Carla Mendes",
    email: "carla.mendes@igreja.com.br",
    role: "MEMBRO",
    isActive: true,
  },
  {
    id: "4",
    name: "Daniel Moreira",
    email: "daniel.moreira@igreja.com.br",
    role: "TESOUREIRO",
    isActive: false,
  },
];

export const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "Culto de Celebração",
    description: "Celebração presencial com transmissão online.",
    location: "Templo Principal",
    startDate: "2026-06-21T19:00:00.000Z",
    endDate: "2026-06-21T21:00:00.000Z",
    isPublic: true,
  },
  {
    id: "2",
    title: "Reunião de Oração",
    description: "Encontro semanal de intercessão.",
    location: "Capela",
    startDate: "2026-06-23T20:00:00.000Z",
    endDate: "2026-06-23T21:00:00.000Z",
    isPublic: true,
  },
  {
    id: "3",
    title: "Escola Bíblica Dominical",
    location: "Salas de Aula",
    startDate: "2026-06-28T09:00:00.000Z",
    endDate: "2026-06-28T11:00:00.000Z",
    isPublic: true,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "ENTRADA",
    category: "DIZIMO",
    value: 2500,
    date: "2026-06-05T12:00:00.000Z",
    description: "Dízimos do culto",
  },
  {
    id: "2",
    type: "ENTRADA",
    category: "OFERTA",
    value: 840,
    date: "2026-06-07T12:00:00.000Z",
    description: "Oferta missionária",
  },
  {
    id: "3",
    type: "SAIDA",
    category: "MANUTENCAO",
    value: 680,
    date: "2026-06-09T12:00:00.000Z",
    description: "Manutenção elétrica",
  },
];

export const mockDashboardSummary: DashboardSummary = {
  totalMembers: 1248,
  activeVolunteers: 156,
  upcomingEvents: 18,
  monthlyIncome: 48750,
  pendingExpenses: 8350,
  monthlyBirthdays: 24,
  source: "mock",
};

export const revenueSeries = [
  { month: "Jan", entradas: 24500, saidas: 8200 },
  { month: "Fev", entradas: 36000, saidas: 9300 },
  { month: "Mar", entradas: 41200, saidas: 12000 },
  { month: "Abr", entradas: 33400, saidas: 8700 },
  { month: "Mai", entradas: 49800, saidas: 10200 },
  { month: "Jun", entradas: 57200, saidas: 13100 },
];

export const expenseByCategory = [
  { name: "Ministérios", value: 15600 },
  { name: "Pessoal", value: 10200 },
  { name: "Manutenção", value: 6850 },
  { name: "Comunicação", value: 4300 },
  { name: "Outros", value: 3300 },
];

export const ownerChurches: OwnerChurch[] = [
  {
    id: "1",
    name: "Igreja Batista Central",
    plan: "Premium",
    status: "Ativa",
    city: "São Paulo - SP",
    admin: "Ana Clara Souza",
    renewalDate: "12/07/2026",
  },
  {
    id: "2",
    name: "Igreja Esperança",
    plan: "Padrão",
    status: "Ativa",
    city: "Rio de Janeiro - RJ",
    admin: "Marcos Antônio",
    renewalDate: "08/07/2026",
  },
  {
    id: "3",
    name: "Comunidade da Graça",
    plan: "Básico",
    status: "Em teste",
    city: "Belo Horizonte - MG",
    admin: "Juliana Pereira",
    renewalDate: "22/06/2026",
  },
  {
    id: "4",
    name: "Igreja Nova Aliança",
    plan: "Premium",
    status: "Atrasada",
    city: "Curitiba - PR",
    admin: "Bruno Farias",
    renewalDate: "05/06/2026",
  },
];
