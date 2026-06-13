import { Transaction } from "@/types/transaction";
import { getTransactionCategoryLabel } from "@/utils/transaction";

export type DashboardPeriod =
  | "SETE_DIAS"
  | "TRINTA_DIAS"
  | "MES"
  | "ANO"
  | "TUDO";

export type DashboardCategoryFilter =
  | "TODAS"
  | "DIZIMO"
  | "OFERTA"
  | "OUTRAS";

interface DateBucket {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

const pieColors = [
  "#6636B5",
  "#23A455",
  "#FFA62B",
  "#3778D4",
  "#E35D9A",
  "#8A63D2",
  "#6B7280",
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function createDailyBuckets(days: number) {
  const today = startOfDay(new Date());
  const firstDay = addDays(today, -(days - 1));

  return Array.from({ length: days }, (_, index) => {
    const start = addDays(firstDay, index);

    return {
      key: start.toISOString(),
      label: start.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      start,
      end: addDays(start, 1),
    };
  });
}

function createThirtyDayBuckets() {
  const today = startOfDay(new Date());
  const firstDay = addDays(today, -29);

  return Array.from({ length: 6 }, (_, index) => {
    const start = addDays(firstDay, index * 5);
    const end = index === 5 ? addDays(today, 1) : addDays(start, 5);

    return {
      key: start.toISOString(),
      label: `${start.getDate()}/${start.getMonth() + 1}`,
      start,
      end,
    };
  });
}

function createMonthBuckets() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const ranges = [
    [1, 8],
    [8, 15],
    [15, 22],
    [22, lastDay + 1],
  ];

  return ranges.map(([startDay, endDay]) => ({
    key: `${year}-${month}-${startDay}`,
    label: `${startDay}-${Math.min(endDay - 1, lastDay)}`,
    start: new Date(year, month, startDay),
    end: new Date(year, month, endDay),
  }));
}

function createYearBuckets(year: number) {
  return Array.from({ length: 12 }, (_, month) => ({
    key: `${year}-${month}`,
    label: new Date(year, month, 1)
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", ""),
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 1),
  }));
}

function createAllBuckets(transactions: Transaction[]) {
  const years = Array.from(
    new Set(
      transactions.map((transaction) =>
        new Date(transaction.date).getFullYear(),
      ),
    ),
  ).sort((a, b) => a - b);

  if (years.length <= 1) {
    return createYearBuckets(years[0] || new Date().getFullYear());
  }

  return years.map((year) => ({
    key: String(year),
    label: String(year),
    start: new Date(year, 0, 1),
    end: new Date(year + 1, 0, 1),
  }));
}

function getBuckets(
  period: DashboardPeriod,
  transactions: Transaction[],
): DateBucket[] {
  if (period === "SETE_DIAS") {
    return createDailyBuckets(7);
  }

  if (period === "TRINTA_DIAS") {
    return createThirtyDayBuckets();
  }

  if (period === "MES") {
    return createMonthBuckets();
  }

  if (period === "ANO") {
    return createYearBuckets(new Date().getFullYear());
  }

  return createAllBuckets(transactions);
}

function isInSelectedPeriod(date: Date, period: DashboardPeriod) {
  const today = startOfDay(new Date());

  if (period === "SETE_DIAS") {
    return date >= addDays(today, -6) && date < addDays(today, 1);
  }

  if (period === "TRINTA_DIAS") {
    return date >= addDays(today, -29) && date < addDays(today, 1);
  }

  if (period === "MES") {
    return (
      date >= new Date(today.getFullYear(), today.getMonth(), 1) &&
      date < new Date(today.getFullYear(), today.getMonth() + 1, 1)
    );
  }

  if (period === "ANO") {
    return (
      date >= new Date(today.getFullYear(), 0, 1) &&
      date < new Date(today.getFullYear() + 1, 0, 1)
    );
  }

  return true;
}

export function filterDashboardTransactions(
  transactions: Transaction[],
  period: DashboardPeriod,
  category: DashboardCategoryFilter,
) {
  return transactions.filter((transaction) => {
    const matchesPeriod = isInSelectedPeriod(
      new Date(transaction.date),
      period,
    );
    const matchesCategory =
      category === "TODAS" ||
      transaction.category === category ||
      (category === "OUTRAS" &&
        transaction.category !== "DIZIMO" &&
        transaction.category !== "OFERTA");

    return matchesPeriod && matchesCategory;
  });
}

export function buildDashboardData(
  transactions: Transaction[],
  period: DashboardPeriod,
) {
  const buckets = getBuckets(period, transactions).map((bucket) => ({
    ...bucket,
    income: 0,
    expense: 0,
    balance: 0,
  }));
  const categories = new Map<string, number>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const bucket = buckets.find(
      (item) => date >= item.start && date < item.end,
    );

    if (bucket) {
      if (transaction.type === "ENTRADA") {
        bucket.income += transaction.value;
      } else {
        bucket.expense += transaction.value;
      }

      bucket.balance = bucket.income - bucket.expense;
    }

    const categoryLabel = getTransactionCategoryLabel(transaction.category);
    categories.set(
      categoryLabel,
      (categories.get(categoryLabel) || 0) + transaction.value,
    );
  });

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "ENTRADA")
    .reduce((total, transaction) => total + transaction.value, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "SAIDA")
    .reduce((total, transaction) => total + transaction.value, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    monthlyBars: buckets.map((bucket) => ({
      label: bucket.label,
      income: bucket.income,
      expense: bucket.expense,
    })),
    balanceLine: buckets.map((bucket) => ({
      label: bucket.label,
      value: bucket.balance,
    })),
    categoryData: Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], index) => ({
        label,
        value,
        color: pieColors[index % pieColors.length],
      })),
  };
}
