import { useService } from "./useService";
import { ownerService } from "@/services/ownerService";

export function useOwnerTransactions() {
  const { data, loading, error } = useService({
    fetcher: () => ownerService.transactions(),
    deps: [],
  });

  return { transactions: data ?? [], loading, error } as const;
}
