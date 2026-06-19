import { useService } from "./useService";
import { ownerService } from "@/services/ownerService";

export function useOwnerDashboard() {
  const { data, loading, error } = useService({
    fetcher: () => ownerService.dashboard(),
    deps: [],
  });

  return { dashboard: data ?? null, loading, error } as const;
}
