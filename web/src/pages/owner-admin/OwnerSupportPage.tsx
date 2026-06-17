import { Headphones, MessageSquare, Timer, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";

const tickets = [
  ["Falha no processamento de cobrança", "Igreja Esperança", "Alta", "10 min"],
  ["Erro ao integrar PagSeguro", "Igreja Nova Aliança", "Média", "35 min"],
  ["Acesso de usuário não funciona", "Igreja Vida Plena", "Baixa", "1 h"],
  ["Relatório financeiro inconsistente", "Igreja Batista Central", "Média", "2 h"],
];

export function OwnerSupportPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        description="Fila de atendimento, SLA e histórico de solicitações das igrejas."
        title="Suporte"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Headphones} title="Tickets abertos" value="27" tone="amber" />
        <StatCard icon={Timer} title="SLA médio" value="42 min" />
        <StatCard icon={MessageSquare} title="Respondidos hoje" value="58" tone="teal" />
        <StatCard icon={UserRound} title="Clientes críticos" value="4" tone="red" />
      </div>
      <Card>
        <h2 className="mb-4 font-bold text-navy-950">Tickets recentes</h2>
        <div className="space-y-3">
          {tickets.map(([title, church, priority, time]) => (
            <div className="grid gap-3 rounded-2xl border border-slate-100 p-4 md:grid-cols-[1fr_auto_auto]" key={title}>
              <div>
                <p className="font-bold text-navy-950">{title}</p>
                <p className="text-sm text-slate-500">{church}</p>
              </div>
              <Badge tone={priority === "Alta" ? "red" : priority === "Média" ? "amber" : "teal"}>{priority}</Badge>
              <span className="text-sm font-semibold text-slate-500">{time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
