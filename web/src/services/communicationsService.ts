import { api, unwrapApiData } from "@/services/api";
import type {
  ApiEnvelope,
  CommunicationNotice,
  CommunicationStatus,
} from "@/types";

type CreateCommunicationPayload = {
  title: string;
  message: string;
  audience: string;
  channel?: string;
  status?: CommunicationStatus;
};

export const communicationsService = {
  async list() {
    const { data } = await api.get<
      ApiEnvelope<CommunicationNotice[]> | CommunicationNotice[]
    >("/communications");

    return unwrapApiData(data);
  },

  async create(payload: CreateCommunicationPayload) {
    const { data } = await api.post<
      ApiEnvelope<CommunicationNotice> | CommunicationNotice
    >("/communications", payload);

    return unwrapApiData(data);
  },

  async remove(id: string) {
    await api.delete(`/communications/${id}`);
  },
};
