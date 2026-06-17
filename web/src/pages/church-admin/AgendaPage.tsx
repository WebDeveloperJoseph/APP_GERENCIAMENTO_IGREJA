import { CalendarDays, Clock, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockEvents } from "@/data/mockData";

const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function AgendaPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Novo compromisso
          </Button>
        }
        description="Visualize cultos, reuniões, ensaios e reservas de recursos."
        title="Agenda"
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-navy-950">Semana atual</h2>
            <CalendarDays className="h-5 w-5 text-blue-700" />
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((day, index) => (
              <div
                className={`rounded-2xl p-4 text-center ${
                  index === 2 ? "bg-navy-800 text-white" : "bg-slate-50 text-navy-950"
                }`}
                key={day}
              >
                <p className="text-xs font-semibold">{day}</p>
                <strong className="mt-2 block text-xl">{18 + index}</strong>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {["Leitura Bíblica • 06:00", "Reunião de Oração • 20:00", "Ensaio do Louvor • 17:00"].map((item) => (
              <div className="rounded-2xl bg-blue-50 p-4 font-semibold text-navy-950" key={item}>
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-bold text-navy-950">Eventos cadastrados</h2>
          <div className="space-y-3">
            {mockEvents.map((event) => (
              <div className="rounded-2xl border border-slate-100 p-4" key={event.id}>
                <h3 className="font-bold text-navy-950">{event.title}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(event.startDate).toLocaleString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
