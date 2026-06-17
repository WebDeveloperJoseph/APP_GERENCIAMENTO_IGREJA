import { AlertTriangle, Banknote, CheckCircle2, Download } from "lucide-react";

import { RevenueChart } from "@/components/charts/RevenueChart";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";

const invoices = [
  ["Igreja Fonte da Vida", "R$ 199,00", "12/06/2026", "Atrasada"],
  ["Comunidade da Graça", "R$ 99,00", "15/06/2026", "Pendente"],
  ["Igreja Nova Aliança", "R$ 199,00", "18/06/2026", "Pendente"],
  ["Igreja Restauração", "R$ 399,00", "20/06/2026", "Pendente"],
];

export function OwnerBillingPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={<Button variant="outline"><Download className="h-4 w-4" /> Exportar</Button>}
        description="Receita, cobranças, inadimplência e repasses da plataforma."
        title="Financeiro SaaS"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Banknote} title="Receita do mês" value="R$ 63.700" tone="teal" />
        <StatCard icon={AlertTriangle} title="Cobranças pendentes" value="R$ 7.860" tone="amber" />
        <StatCard icon={CheckCircle2} title="Pagamentos confirmados" value="1.982" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-bold text-navy-950">Receita recorrente</h2>
          <RevenueChart />
        </Card>
        <Card>
          <h2 className="mb-4 font-bold text-navy-950">Cobranças pendentes</h2>
          <div className="space-y-3">
            {invoices.map(([church, value, dueDate, status]) => (
              <div className="rounded-2xl bg-slate-50 p-4" key={church}>
                <div className="flex justify-between gap-3">
                  <strong>{church}</strong>
                  <Badge tone={status === "Atrasada" ? "red" : "amber"}>{status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">Venc.: {dueDate}</p>
                <p className="mt-2 font-black text-navy-950">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
