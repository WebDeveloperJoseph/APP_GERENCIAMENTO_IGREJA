import { api, unwrapApiData } from "@/services/api";
import type { ApiEnvelope, BillingOverview } from "@/types";

export const billingService = {
  async overview() {
    const { data } = await api.get<ApiEnvelope<BillingOverview> | BillingOverview>("/billing");
    return unwrapApiData(data);
  },
  async createCheckout(planId: string) {
    const { data } = await api.post<ApiEnvelope<{ id: string; link: string; status: string }>>("/billing/checkout", { planId });
    return unwrapApiData(data);
  },
};
