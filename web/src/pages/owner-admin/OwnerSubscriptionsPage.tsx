import { AlertTriangle, CreditCard, PauseCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ownerService } from "@/services/ownerService";
import type { OwnerSubscriptionsResult, SubscriptionStatus } from "@/types";

const statusLabel: Record<SubscriptionStatus, string> = {
  TRIALING: "Em teste", ACTIVE: "Ativa", PAST_DUE: "Atrasada", PAUSED: "Pausada", CANCELED: "Cancelada",
};

export function OwnerSubscriptionsPage() {
  const [data, setData] = useState<OwnerSubscriptionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ownerService.subscriptions().then(setData).catch((err) =>
      setError(err instanceof Error ? err.message : "Falha ao carregar assinaturas."),
    );
  }, []);

  return <div className="space-y-6">
    <SectionHeader description="Assinaturas, testes, inadimplência e receita recorrente vindos da API." title="Assinaturas" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={CreditCard} title="Assinaturas ativas" value={String(data?.summary.ACTIVE ?? 0)} />
      <StatCard icon={TrendingUp} title="MRR" value={(data?.summary.mrr ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} tone="teal" />
      <StatCard icon={PauseCircle} title="Em teste" value={String(data?.summary.TRIALING ?? 0)} tone="amber" />
      <StatCard icon={AlertTriangle} title="Inadimplentes" value={String(data?.summary.PAST_DUE ?? 0)} tone="red" />
    </div>
    <Card>
      {error ? <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      : data && data.subscriptions.length === 0 ? <EmptyState message="Nenhuma assinatura cadastrada. Novas igrejas aparecerão aqui ao iniciar o período de teste." />
      : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500"><tr><th className="px-4 py-3">Igreja</th><th className="px-4 py-3">Plano</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Valor</th><th className="px-4 py-3">Próximo marco</th></tr></thead>
        <tbody>{data?.subscriptions.map((subscription) => {
          const date = subscription.currentPeriodEnd ?? subscription.trialEndsAt;
          return <tr className="border-t border-slate-100" key={subscription.id}>
            <td className="px-4 py-4 font-bold text-navy-950">{subscription.church.name}</td><td className="px-4 py-4">{subscription.plan.name}</td>
            <td className="px-4 py-4"><Badge tone={subscription.status === "PAST_DUE" || subscription.status === "CANCELED" ? "red" : subscription.status === "TRIALING" ? "amber" : "teal"}>{statusLabel[subscription.status]}</Badge></td>
            <td className="px-4 py-4">{(subscription.plan.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td className="px-4 py-4 text-slate-500">{date ? new Date(date).toLocaleDateString("pt-BR") : "—"}</td>
          </tr>;
        })}</tbody>
      </table></div>}
    </Card>
  </div>;
}
