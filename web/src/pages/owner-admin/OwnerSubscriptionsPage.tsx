import { CreditCard, PauseCircle, RefreshCw, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";

const subscriptions = [
  ["Premium", "1.124", "R$ 199", "Ativo"],
  ["Padrão", "967", "R$ 99", "Ativo"],
  ["Básico", "815", "R$ 49", "Ativo"],
  ["Enterprise", "206", "Sob contrato", "Ativo"],
];

export function OwnerSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={<Button variant="outline">Sincronizar gateway</Button>}
        description="Acompanhe planos, renovações, inadimplência e upgrades."
        title="Assinaturas"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={CreditCard} title="Assinaturas ativas" value="2.548" />
        <StatCard icon={TrendingUp} title="Upgrades no mês" value="84" tone="teal" />
        <StatCard icon={PauseCircle} title="Pausadas" value="39" tone="amber" />
        <StatCard icon={RefreshCw} title="Renovações próximas" value="312" />
      </div>
      <Card>
        <h2 className="mb-4 font-bold text-navy-950">Planos ativos</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {subscriptions.map(([plan, count, price, status]) => (
            <div className="rounded-2xl border border-slate-100 p-5" key={plan}>
              <p className="text-sm text-slate-500">{status}</p>
              <h3 className="mt-1 text-xl font-black text-navy-950">{plan}</h3>
              <p className="mt-4 text-3xl font-black">{count}</p>
              <p className="text-sm font-semibold text-teal-600">{price}/mês</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
