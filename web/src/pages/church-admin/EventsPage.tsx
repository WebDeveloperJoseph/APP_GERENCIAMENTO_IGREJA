import { CalendarDays, MapPin, Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { eventsService } from "@/services/eventsService";
import type { DataSource, EventItem } from "@/types";
import { canManageEvents } from "@/utils/permissions";

const emptyEventForm = {
  title: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
};

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [source, setSource] = useState<DataSource>("api");
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEventForm);
  const [saving, setSaving] = useState(false);
  const canWrite = canManageEvents();

  function reloadEvents() {
    return eventsService.listWithSource().then((result) => {
      setEvents(result.data);
      setSource(result.source);
      setApiMessage(result.error ?? null);
    });
  }

  useEffect(() => {
    reloadEvents();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!canWrite) {
      setApiMessage("Seu perfil nao tem permissao para gerenciar eventos.");
      return;
    }

    setSaving(true);

    try {
      await eventsService.create({
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate || form.startDate).toISOString(),
        isPublic: true,
      });
      setForm(emptyEventForm);
      await reloadEvents();
    } catch (error) {
      setApiMessage(
        error instanceof Error ? error.message : "Falha ao criar evento.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Eventos</h1>
          <p className="text-slate-500">
            Agenda, cultos, conferências e reuniões.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            Dados: {source === "api" ? "backend real" : "indisponível"}
          </span>
          {canWrite ? (
            <Button>
              <Plus className="h-4 w-4" /> Novo evento
            </Button>
          ) : null}
        </div>
      </div>
      {apiMessage ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          API: {apiMessage}. Exibindo somente dados recebidos do servidor.
        </p>
      ) : null}
      {canWrite ? (
        <Card>
          <form className="grid gap-3 md:grid-cols-5" onSubmit={handleSubmit}>
            <input
              className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-2"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Titulo do evento"
              value={form.title}
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="Local"
              value={form.location}
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
              type="datetime-local"
              value={form.startDate}
            />
            <input
              className="rounded-xl border border-slate-200 px-4 py-3"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  endDate: event.target.value,
                }))
              }
              type="datetime-local"
              value={form.endDate}
            />
            <textarea
              className="rounded-xl border border-slate-200 px-4 py-3 md:col-span-4"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Descricao"
              value={form.description}
            />
            <Button disabled={!canWrite || saving} type="submit">
              {saving ? "Salvando..." : "Criar evento"}
            </Button>
          </form>
        </Card>
      ) : null}
      {events.length === 0 ? (
        <EmptyState message="Nenhum evento encontrado." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-bold text-navy-950">{event.title}</h2>
                  <p className="text-sm text-slate-500">
                    {new Date(event.startDate).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">{event.description}</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-800">
                <MapPin className="h-4 w-4" />
                {event.location ?? "Local a definir"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
