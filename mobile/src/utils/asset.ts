import {
  ASSET_STATUS_OPTIONS,
  AssetStatus,
} from "@/types/asset";

export function getAssetStatusLabel(status: AssetStatus) {
  return (
    ASSET_STATUS_OPTIONS.find((option) => option.value === status)?.label ||
    status
  );
}

export function parseAssetValue(value: string) {
  const normalizedValue = value.includes(",")
    ? value.replace(/\./g, "").replace(",", ".")
    : value;

  return Number(normalizedValue);
}

export function formatAssetDate(date?: string | null) {
  if (!date) {
    return "Não informada";
  }

  const [year, month, day] = date.substring(0, 10).split("-");

  return `${day}/${month}/${year}`;
}
