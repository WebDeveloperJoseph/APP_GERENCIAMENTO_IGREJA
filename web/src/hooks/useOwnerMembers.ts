import { useService } from "./useService";
import { ownerService } from "@/services/ownerService";

export function useOwnerMembers() {
  const { data, loading, error } = useService({
    fetcher: () => ownerService.members(),
    deps: [],
  });

  return { members: data ?? [], loading, error } as const;
}
