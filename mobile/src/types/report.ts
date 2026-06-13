import { Transaction } from "@/types/transaction";

export interface ReportSummary {
  period: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  };
  totalMembers: number;
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  totalDizimos: number;
  totalOfertas: number;
  latestTransactions: Transaction[];
}
