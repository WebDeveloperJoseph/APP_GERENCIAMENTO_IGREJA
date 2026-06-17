import { ASSET_STATUS_OPTIONS, AssetStatus } from "@/types/asset";

export function getAssetStatusLabel(status: AssetStatus) {
  return (
    ASSET_STATUS_OPTIONS.find((option) => option.value === status)?.label ||
    status
  );
}

/**
 * 🔑 Converte com segurança o valor em string/moeda vindo do input para um Number válido.
 * Trata casos de valores indefinidos, nulos ou numéricos purificados.
 */
export function parseAssetValue(value: any) {
  // 💡 1. Se o valor for nulo, indefinido ou string vazia, retorna zero direto
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  // 💡 2. Força a conversão para String para garantir a existência do método .includes()
  const stringValue = String(value);

  // 💡 3. Faz a normalização da formatação de moeda brasileira (remover pontos e trocar vírgula por ponto)
  const normalizedValue = stringValue.includes(",")
    ? stringValue.replace(/\./g, "").replace(",", ".")
    : stringValue;

  return Number(normalizedValue);
}

export function formatAssetDate(date?: string | null) {
  if (!date) {
    return "Não informada";
  }

  const [year, month, day] = date.substring(0, 10).split("-");

  return `${day}/${month}/${year}`;
}
