import { useService } from "./useService";
import { membersService } from "@/services/membersService";
import type { Member } from "@/types";

export function useMembers() {
  const { data, loading, error } = useService<Member[]>({
    fetcher: () => membersService.list(),
    deps: [],
  });

  return { members: data ?? [], loading, error } as const;
}
