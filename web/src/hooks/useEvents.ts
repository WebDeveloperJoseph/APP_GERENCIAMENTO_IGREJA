import { useService } from "./useService";
import { eventsService } from "@/services/eventsService";
import type { EventItem } from "@/types";

export function useEvents() {
  const { data, loading, error } = useService<EventItem[]>({
    fetcher: () => eventsService.list(),
    deps: [],
  });

  return { events: data ?? [], loading, error } as const;
}
