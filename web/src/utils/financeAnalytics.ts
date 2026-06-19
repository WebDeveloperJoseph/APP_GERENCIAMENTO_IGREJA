import type { Transaction } from "@/types";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
}

export function buildRevenueSeries(transactions: Transaction[], months = 6) {
  const now = new Date();
  const buckets = new Map<
    string,
    { month: string; entradas: number; saidas: number }
  >();

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.set(monthKey(d), {
      month: monthLabel(d),
      entradas: 0,
      saidas: 0,
    });
  }

  transactions.forEach((transaction) => {
    const d = new Date(transaction.date);
    const key = monthKey(d);
    const bucket = buckets.get(key);

    if (!bucket) return;

    if (transaction.type === "ENTRADA") {
      bucket.entradas += transaction.value;
    } else {
      bucket.saidas += transaction.value;
    }
  });

  return Array.from(buckets.values());
}

export function buildExpenseByCategory(transactions: Transaction[]) {
  const grouped = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === "SAIDA")
    .forEach((transaction) => {
      const current = grouped.get(transaction.category) ?? 0;
      grouped.set(transaction.category, current + transaction.value);
    });

  return Array.from(grouped.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
