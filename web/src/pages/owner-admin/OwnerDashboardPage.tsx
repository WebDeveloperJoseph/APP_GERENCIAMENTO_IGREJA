import {
  Building2,
  CalendarDays,
  CreditCard,
  Headphones,
  Megaphone,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { ExpenseDonut } from "@/components/charts/ExpenseDonut";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ownerChurches } from "@/data/mockData";

export function OwnerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-black text-navy-950">
            Bem-vindo, Souza José! 👋
          </h1>
          <p className="text-slate-500">Aqui está a visão geral do seu SaaS hoje.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <CalendarDays className="h-4 w-4" /> Maio/2026
          </Button>
          <Button variant="outline">Exportar relatório</Button>
          <Button>
            <Megaphone className="h-4 w-4" /> Nova campanha
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Building2} title="Igrejas ativas" value="2.548" helper="↑ 8,3%" />
        <StatCard icon={Users} title="Testes gratuitos" value="186" helper="↑ 12,4%" tone="teal" />
        <StatCard icon={CreditCard} title="MRR" value="R$ 48.900" helper="↑ 9,7%" />
        <StatCard icon={TrendingUp} title="Receita do mês" value="R$ 63.700" helper="↑ 11,2%" tone="teal" />
        <StatCard icon={TrendingDown} title="Churn" value="3,1%" helper="↓ 0,6 p.p." tone="red" />
        <StatCard icon={Headphones} title="Tickets abertos" value="27" helper="↑ 12,5%" tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <Card>
          <h2 className="font-bold text-navy-950">Receita recorrente</h2>
          <RevenueChart />
        </Card>
        <Card>
          <h2 className="font-bold text-navy-950">Distribuição por plano</h2>
          <ExpenseDonut />
        </Card>
        <Card>
          <h2 className="font-bold text-navy-950">Funil de leads</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Lead", "1.248"],
              ["Demonstração", "462"],
              ["Teste grátis", "186"],
              ["Ativado", "98"],
            ].map(([label, value]) => (
              <div className="flex justify-between rounded-2xl bg-blue-50 p-4" key={label}>
                <span className="font-semibold">{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.8fr]">
        <Card>
          <h2 className="mb-4 font-bold text-navy-950">Igrejas recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Igreja</th>
                  <th className="px-4 py-3">Plano</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Cidade</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Renovação</th>
                </tr>
              </thead>
              <tbody>
                {ownerChurches.map((church) => (
                  <tr className="border-t border-slate-100" key={church.id}>
                    <td className="px-4 py-4 font-bold">{church.name}</td>
                    <td className="px-4 py-4"><Badge>{church.plan}</Badge></td>
                    <td className="px-4 py-4">
                      <Badge tone={church.status === "Atrasada" ? "red" : church.status === "Em teste" ? "amber" : "teal"}>
                        {church.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">{church.city}</td>
                    <td className="px-4 py-4">{church.admin}</td>
                    <td className="px-4 py-4">{church.renewalDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <h2 className="font-bold text-navy-950">Tickets de suporte</h2>
            <div className="mt-4 space-y-3">
              {["Falha no processamento de cobrança", "Erro ao integrar PagSeguro", "Usuário não funciona"].map((ticket, index) => (
                <div className="rounded-2xl bg-slate-50 p-3" key={ticket}>
                  <Badge tone={index === 0 ? "red" : "amber"}>{index === 0 ? "Alta" : "Média"}</Badge>
                  <p className="mt-2 font-semibold">{ticket}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 font-bold text-navy-950">Ações rápidas</h2>
            <div className="grid grid-cols-2 gap-3">
              {["Criar plano", "Nova campanha", "Ver faturamento", "Adicionar usuário"].map((action) => (
                <Button className="py-2" key={action} variant="outline">{action}</Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
