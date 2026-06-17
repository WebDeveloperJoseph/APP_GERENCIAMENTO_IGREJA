import {
  BookOpen,
  CalendarDays,
  Gift,
  HeartHandshake,
  Megaphone,
  Users,
  Wallet,
} from "lucide-react";

import { Brand } from "@/components/layout/Brand";
import { Card } from "@/components/ui/Card";
import { mockEvents, mockMembers } from "@/data/mockData";

const shortcuts = [
  ["Minhas Células", "Acompanhe sua célula e mensagens.", Users],
  ["Membros", "Conecte-se com outros membros.", Users],
  ["Minhas Ofertas", "Veja seus dízimos e ofertas.", Wallet],
  ["Notícias", "Fique por dentro das novidades.", Megaphone],
] as const;

export function MemberHomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white px-5 lg:px-12">
        <Brand />
        <div className="text-right">
          <p className="font-bold text-navy-950">Lucas Silva</p>
          <p className="text-sm text-slate-500">Membro</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Bom dia, Lucas! 👋</h1>
          <p className="text-slate-500">Que hoje seja um dia de fé, comunhão e propósito.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {shortcuts.map(([title, description, Icon]) => (
            <Card key={title}>
              <Icon className="h-9 w-9 text-teal-600" />
              <h2 className="mt-4 font-bold">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.9fr]">
          <Card>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-navy-950">
              <CalendarDays className="h-5 w-5" /> Próximos Cultos e Eventos
            </h2>
            <div className="space-y-3">
              {mockEvents.map((event) => (
                <div className="rounded-2xl bg-slate-50 p-4" key={event.id}>
                  <p className="font-bold">{event.title}</p>
                  <p className="text-sm text-slate-500">{event.location}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-navy-950">
              <HeartHandshake className="h-5 w-5" /> Pedidos de oração
            </h2>
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Ore pela saúde de Maria Aparecida e pela família do irmão João.
            </p>
            <h2 className="mt-6 mb-3 flex items-center gap-2 font-bold text-navy-950">
              <BookOpen className="h-5 w-5" /> Versículo do dia
            </h2>
            <p className="text-slate-600">
              “Confie no Senhor de todo o seu coração...” Provérbios 3:5-6
            </p>
          </Card>
          <Card>
            <h2 className="mb-4 flex items-center gap-2 font-bold text-navy-950">
              <Gift className="h-5 w-5" /> Aniversariantes
            </h2>
            <div className="space-y-3">
              {mockMembers.slice(0, 4).map((member) => (
                <div className="flex justify-between rounded-2xl bg-slate-50 p-3" key={member.id}>
                  <span className="font-semibold">{member.name}</span>
                  <span className="text-sm text-slate-500">Mai</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
