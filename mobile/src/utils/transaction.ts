import {
  TRANSACTION_CATEGORY_OPTIONS,
  TransactionCategory,
  TransactionType,
} from "@/types/transaction";

export function getTransactionCategoryLabel(category: TransactionCategory) {
  return (
    TRANSACTION_CATEGORY_OPTIONS.find((option) => option.value === category)
      ?.label || category
  );
}

export function getTransactionTypeLabel(type: TransactionType) {
  return type === "ENTRADA" ? "Entrada" : "Saída";
}

export function parseTransactionValue(value: string) {
  const normalizedValue = value.includes(",")
    ? value.replace(/\./g, "").replace(",", ".")
    : value;

  return Number(normalizedValue);
}

export function formatDate(date: string) {
  const [year, month, day] = date.substring(0, 10).split("-");

  return `${day}/${month}/${year}`;
}

export function toDateInput(date: string) {
  return date.substring(0, 10);
}

export function getTodayDateInput() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
}

export function isValidDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
