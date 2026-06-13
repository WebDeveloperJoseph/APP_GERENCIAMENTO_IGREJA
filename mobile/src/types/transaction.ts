import { Member } from "@/types/member";

export type TransactionType = "ENTRADA" | "SAIDA";

export type TransactionCategory =
  | "DIZIMO"
  | "OFERTA"
  | "ALUGUEL"
  | "ENERGIA"
  | "AGUA"
  | "MANUTENCAO"
  | "OUTROS";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  value: number;
  date: string;
  description: string | null;
  memberId: string | null;
  member: Member | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormValues {
  type: TransactionType;
  category: TransactionCategory;
  value: string;
  date: string;
  description: string;
  memberId?: string;
}

export interface TransactionCategoryOption {
  label: string;
  value: TransactionCategory;
}

export const TRANSACTION_CATEGORY_OPTIONS: TransactionCategoryOption[] = [
  { label: "Dízimo", value: "DIZIMO" },
  { label: "Oferta", value: "OFERTA" },
  { label: "Aluguel", value: "ALUGUEL" },
  { label: "Energia", value: "ENERGIA" },
  { label: "Água", value: "AGUA" },
  { label: "Manutenção", value: "MANUTENCAO" },
  { label: "Outros", value: "OUTROS" },
];
