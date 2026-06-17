import {
  Cake,
  CalendarDays,
  DollarSign,
  Receipt,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ExpenseDonut } from "@/components/charts/ExpenseDonut";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { dashboardService } from "@/services/dashboardService";
import { eventsService } from "@/services/eventsService";
import { membersService } from "@/services/membersService";
import { transactionsService } from "@/services/transactionsService";
import type { DashboardSummary, EventItem, Member, Transaction } from "@/types";

export function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.summary(),
      membersService.listWithSource(),
      eventsService.listWithSource(),
      transactionsService.listWithSource(),
    ])
      .then(([summaryData, membersResult, eventsResult, transactionsResult]) => {
        setSummary({
          ...summaryData,
          totalMembers: membersResult.data.length || summaryData.totalMembers,
          activeVolunteers:
            membersResult.data.filter((member) => member.role === "VOLUNTARIO")
              .length || summaryData.activeVolunteers,
          upcomingEvents: eventsResult.data.length || summaryData.upcomingEvents,
          monthlyBirthdays:
            membersResult.data.filter((member) => Boolean(member.birthDate))
              .length || summaryData.monthlyBirthdays,
          source:
            summaryData.source === "api" ||
            membersResult.source === "api" ||
            eventsResult.source === "api" ||
            transactionsResult.source === "api"
              ? "api"
              : "mock",
        });
        setMembers(membersResult.data);
        setEvents(eventsResult.data);
        setTransactions(transactionsResult.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const data = summary ?? {
    totalMembers: 0,
    activeVolunteers: 0,
    upcomingEvents: 0,
    monthlyIncome: 0,
    pendingExpenses: 0,
    monthlyBirthdays: 0,
    source: "mock" as const,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black text-navy-950">
            Bem-vindo, Pr. Lucas! 👋
          </h1>
          <p className="mt-1 text-slate-500">Aqui está o resumo da sua igreja hoje.</p>
        </div>
        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          {loading
            ? "Carregando API..."
            : `Dados: ${data.source === "api" ? "backend real" : "modo demonstracao"}`}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard icon={Users} title="Total de membros" value={data.totalMembers.toLocaleString("pt-BR")} helper="↑ 3,4% vs mês anterior" />
        <StatCard icon={UserCheck} title="Voluntários ativos" value={String(data.activeVolunteers)} helper="↑ 7,2% vs mês anterior" />
        <StatCard icon={CalendarDays} title="Próximos eventos" value={String(data.upcomingEvents)} helper="2 eventos esta semana" />
        <StatCard icon={DollarSign} title="Arrecadações (mês)" value={`R$ ${data.monthlyIncome.toLocaleString("pt-BR")}`} helper="↑ 12,5% vs mês anterior" tone="teal" />
        <StatCard icon={Receipt} title="Despesas pendentes" value={`R$ ${data.pendingExpenses.toLocaleString("pt-BR")}`} helper="↓ 4,3% vs mês anterior" tone="red" />
        <StatCard icon={Cake} title="Aniversariantes" value={String(data.monthlyBirthdays)} helper="6 esta semana" tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr_0.9fr]">
        <Card>
          <h2 className="font-bold text-navy-950">Arrecadações (últimos 6 meses)</h2>
          <RevenueChart />
        </Card>
        <Card>
          <h2 className="font-bold text-navy-950">Despesas por categoria</h2>
          <ExpenseDonut />
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-navy-950">Próximos eventos</h2>
            <span className="text-sm font-bold text-blue-700">Ver todos</span>
          </div>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div className="rounded-2xl border border-slate-100 p-4" key={event.id}>
                <p className="font-bold text-navy-950">{event.title}</p>
                <p className="text-sm text-slate-500">{event.location}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold text-navy-950">Atividades recentes</h2>
          <div className="mt-4 space-y-4">
            {transactions.slice(0, 4).map((transaction) => (
              <div className="flex items-center justify-between border-b border-slate-100 pb-3" key={transaction.id}>
                <span className="font-medium text-slate-700">
                  {transaction.description ?? transaction.category}
                </span>
                <span className="text-sm text-slate-400">
                  R$ {transaction.value.toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-bold text-navy-950">Aniversariantes do mês</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {members.slice(0, 4).map((member) => (
              <div className="rounded-2xl bg-slate-50 p-3" key={member.id}>
                <p className="font-bold">{member.name}</p>
                <p className="text-sm text-slate-500">{member.birthDate ? "Maio" : "Data não informada"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
