import { Bell, Mail, Megaphone, MessageCircle, Plus, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";

const notices = [
  {
    title: "Campanha de alimentos",
    channel: "App + E-mail",
    status: "Enviado",
    audience: "Todos os membros",
  },
  {
    title: "Lembrete do culto de domingo",
    channel: "Push",
    status: "Agendado",
    audience: "Membros ativos",
  },
  {
    title: "Escala do louvor",
    channel: "WhatsApp",
    status: "Rascunho",
    audience: "Ministério de louvor",
  },
];

export function CommunicationPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Novo comunicado
          </Button>
        }
        description="Centralize avisos, campanhas e mensagens para a igreja."
        title="Comunicação"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Megaphone} title="Comunicados" value="32" />
        <StatCard icon={Bell} title="Push enviados" value="1.842" tone="teal" />
        <StatCard icon={Mail} title="E-mails abertos" value="68%" />
        <StatCard icon={MessageCircle} title="Campanhas ativas" value="4" tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="mb-4 font-bold text-navy-950">Comunicados recentes</h2>
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                className="grid gap-3 rounded-2xl border border-slate-100 p-4 md:grid-cols-[1fr_auto_auto]"
                key={notice.title}
              >
                <div>
                  <p className="font-bold text-navy-950">{notice.title}</p>
                  <p className="text-sm text-slate-500">{notice.audience}</p>
                </div>
                <span className="text-sm font-semibold text-blue-700">{notice.channel}</span>
                <span className="text-sm font-semibold text-teal-600">{notice.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-navy-950">Criar aviso rápido</h2>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Título do comunicado"
            />
            <textarea
              className="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Mensagem para os membros..."
            />
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Todos os membros</option>
              <option>Pastores e líderes</option>
              <option>Ministério de louvor</option>
            </select>
            <Button className="w-full">
              <Send className="h-4 w-4" />
              Enviar comunicado
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
