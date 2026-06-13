export type AssetStatus = "ATIVO" | "MANUTENCAO" | "BAIXADO";

export interface Asset {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  category: string;
  value: number;
  acquisitionDate: string | null;
  location: string | null;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AssetFormValues {
  name: string;
  imageUrl: string;
  description: string;
  category: string;
  value: string;
  acquisitionDate: string;
  location: string;
  status: AssetStatus;
}

export interface AssetStatusOption {
  label: string;
  value: AssetStatus;
}

export const ASSET_STATUS_OPTIONS: AssetStatusOption[] = [
  { label: "Ativo", value: "ATIVO" },
  { label: "Manutenção", value: "MANUTENCAO" },
  { label: "Baixado", value: "BAIXADO" },
];
