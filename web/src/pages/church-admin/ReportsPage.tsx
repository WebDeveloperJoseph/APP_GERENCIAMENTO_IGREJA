import { Download, FileText, TrendingUp, Users, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ExpenseDonut } from "@/components/charts/ExpenseDonut";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { eventsService } from "@/services/eventsService";
import { membersService } from "@/services/membersService";
import { transactionsService } from "@/services/transactionsService";
import type { EventItem, Member, Transaction } from "@/types";
import {
  buildExpenseByCategory,
  buildRevenueSeries,
} from "@/utils/financeAnalytics";

export function ReportsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      membersService.list(),
      eventsService.list(),
      transactionsService.list(),
    ])
      .then(([membersData, eventsData, transactionsData]) => {
        setMembers(membersData);
        setEvents(eventsData);
        setTransactions(transactionsData);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar relatórios.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const entradas = transactions
      .filter((transaction) => transaction.type === "ENTRADA")
      .reduce((sum, transaction) => sum + transaction.value, 0);

    const saidas = transactions
      .filter((transaction) => transaction.type === "SAIDA")
      .reduce((sum, transaction) => sum + transaction.value, 0);

    const saldo = entradas - saidas;
    const ativos = members.filter((member) => member.isActive !== false).length;
    const presencaAproximada = members.length
      ? Math.round((ativos / members.length) * 100)
      : 0;

    return {
      membrosAtivos: `${ativos}`,
      saldo,
      presencaAproximada,
      relatoriosGerados: events.length + transactions.length,
    };
  }, [events.length, members, transactions]);

  const revenueSeries = useMemo(
    () => buildRevenueSeries(transactions),
    [transactions],
  );
  const expenseByCategory = useMemo(
    () => buildExpenseByCategory(transactions),
    [transactions],
  );

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
        <StatCard
          icon={Users}
          title="Membros ativos"
          value={stats.membrosAtivos}
          tone="teal"
        />
        <StatCard
          icon={Wallet}
          title="Saldo atual"
          value={`R$ ${stats.saldo.toLocaleString("pt-BR")}`}
        />
        <StatCard
          icon={TrendingUp}
          title="Engajamento estimado"
          value={`${stats.presencaAproximada}%`}
        />
        <StatCard
          icon={FileText}
          title="Entradas analisadas"
          value={String(stats.relatoriosGerados)}
          tone="amber"
        />
      </div>

      {loading ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
          Carregando dados de relatórios...
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          API: {error}. Alguns indicadores podem estar incompletos.
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="font-bold text-navy-950">Evolução financeira</h2>
          <RevenueChart data={revenueSeries} />
        </Card>
        <Card>
          <h2 className="font-bold text-navy-950">Distribuição de despesas</h2>
          <ExpenseDonut data={expenseByCategory} />
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
