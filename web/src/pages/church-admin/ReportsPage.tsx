import { Download, FileText, TrendingUp, Users, Wallet } from "lucide-react";

import { ExpenseDonut } from "@/components/charts/ExpenseDonut";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        }
        description="Indicadores para liderança acompanhar crescimento, finanças e participação."
        title="Relatórios"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Users} title="Crescimento de membros" value="+8,3%" tone="teal" />
        <StatCard icon={Wallet} title="Saldo mensal" value="R$ 35.650" />
        <StatCard icon={TrendingUp} title="Presença média" value="74%" />
        <StatCard icon={FileText} title="Relatórios gerados" value="18" tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-bold text-navy-950">Evolução financeira</h2>
          <RevenueChart />
        </Card>
        <Card>
          <h2 className="font-bold text-navy-950">Distribuição de despesas</h2>
          <ExpenseDonut />
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-bold text-navy-950">Relatórios disponíveis</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            "Resumo financeiro mensal",
            "Lista de membros ativos",
            "Aniversariantes do mês",
            "Presença em eventos",
            "Relatório de contribuições",
            "Indicadores de crescimento",
          ].map((report) => (
            <button
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left font-semibold text-navy-950 transition hover:border-blue-300 hover:bg-blue-50"
              key={report}
            >
              {report}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
