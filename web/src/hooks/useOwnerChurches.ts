import { useService } from "./useService";
import { ownerService } from "@/services/ownerService";
import type { OwnerChurch } from "@/types";

export function useOwnerChurches() {
  const { data, loading, error, refetch } = useService<OwnerChurch[]>({
    fetcher: () => ownerService.list(),
    deps: [],
  });

  return { ownerChurches: data ?? [], loading, error, refetch } as const;
}
