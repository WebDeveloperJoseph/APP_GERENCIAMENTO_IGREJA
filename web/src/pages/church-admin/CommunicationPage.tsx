import { Bell, Mail, Megaphone, MessageCircle, Plus, Send } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useEvents } from "@/hooks/useEvents";
import { useMembers } from "@/hooks/useMembers";
import { communicationsService } from "@/services/communicationsService";
import type { CommunicationNotice } from "@/types";
import { canManageCommunication } from "@/utils/permissions";

export function CommunicationPage() {
  const { members } = useMembers();
  const { events } = useEvents();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("Todos os membros");
  const [notices, setNotices] = useState<CommunicationNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canWrite = canManageCommunication();

  useEffect(() => {
    setLoading(true);

    communicationsService
      .list()
      .then((data) => setNotices(data))
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar comunicados.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleCreateNotice(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (!canWrite) {
      setError("Seu perfil não tem permissão para criar comunicados.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const created = await communicationsService.create({
        title: title.trim(),
        message: message.trim(),
        audience,
        channel: "APP",
        status: "ENVIADO",
      });

      setNotices((current) => [created, ...current]);
      setTitle("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao criar comunicado.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNotice(id: string) {
    if (!canWrite) {
      setError("Seu perfil não tem permissão para remover comunicados.");
      return;
    }

    try {
      await communicationsService.remove(id);
      setNotices((current) => current.filter((notice) => notice.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao remover comunicado.",
      );
    }
  }

  function displayStatus(status: CommunicationNotice["status"]) {
    return status === "RASCUNHO" ? "Rascunho" : "Enviado";
  }

  const stats = useMemo(() => {
    const activeMembers = members.filter(
      (member) => member.isActive !== false,
    ).length;

    return {
      comunicados: notices.length,
      pushEnviados: activeMembers,
      emailsAbertos: activeMembers
        ? Math.min(100, Math.round((notices.length / activeMembers) * 100 + 40))
        : 0,
      campanhasAtivas: events.length,
    };
  }, [events.length, members, notices.length]);

  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button disabled={!canWrite}>
            <Plus className="h-4 w-4" />
            Novo comunicado
          </Button>
        }
        description="Centralize avisos, campanhas e mensagens para a igreja."
        title="Comunicação"
      />

      {error ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          API: {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={Megaphone}
          title="Comunicados"
          value={String(stats.comunicados)}
        />
        <StatCard
          icon={Bell}
          title="Push enviados"
          value={stats.pushEnviados.toLocaleString("pt-BR")}
          tone="teal"
        />
        <StatCard
          icon={Mail}
          title="E-mails abertos"
          value={`${stats.emailsAbertos}%`}
        />
        <StatCard
          icon={MessageCircle}
          title="Campanhas ativas"
          value={String(stats.campanhasAtivas)}
          tone="amber"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="mb-4 font-bold text-navy-950">Comunicados recentes</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Carregando comunicados...
              </p>
            ) : notices.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Nenhum comunicado enviado ainda.
              </p>
            ) : (
              notices.map((notice) => (
                <div
                  className="grid gap-3 rounded-2xl border border-slate-100 p-4 md:grid-cols-[1fr_auto_auto]"
                  key={notice.id}
                >
                  <div>
                    <p className="font-bold text-navy-950">{notice.title}</p>
                    <p className="text-sm text-slate-500">{notice.audience}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">
                    {notice.channel}
                  </span>
                  <span className="text-sm font-semibold text-teal-600">
                    {displayStatus(notice.status)}
                  </span>
                  {canWrite ? (
                    <button
                      className="text-xs font-bold text-red-600"
                      onClick={() => handleDeleteNotice(notice.id)}
                      type="button"
                    >
                      Remover
                    </button>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-navy-950">Criar aviso rápido</h2>
          <form className="mt-4 space-y-3" onSubmit={handleCreateNotice}>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              disabled={!canWrite}
              placeholder="Título do comunicado"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
            <textarea
              className="min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              disabled={!canWrite}
              placeholder="Mensagem para os membros..."
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-3"
              disabled={!canWrite}
              onChange={(event) => setAudience(event.target.value)}
              value={audience}
            >
              <option>Todos os membros</option>
              <option>Pastores e líderes</option>
              <option>Ministério de louvor</option>
            </select>
            <Button
              className="w-full"
              disabled={!canWrite || saving}
              type="submit"
            >
              <Send className="h-4 w-4" />
              {saving ? "Enviando..." : "Enviar comunicado"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
