import { Edit, Eye, Plus, Search, Trash2, Users } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { membersService } from "@/services/membersService";
import type { DataSource, Member } from "@/types";
import { canManageMembers } from "@/utils/permissions";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "MEMBRO" as Member["role"],
  password: "",
  isActive: false,
};

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<DataSource>("api");
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const canWrite = canManageMembers();

  function reloadMembers() {
    setLoading(true);
    return membersService
      .listWithSource()
      .then((result) => {
        setMembers(result.data);
        setSource(result.source);
        setApiMessage(result.error ?? null);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reloadMembers();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!canWrite) {
      setApiMessage("Seu perfil nao tem permissao para gerenciar membros.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await membersService.update(editingId, form);
      } else {
        await membersService.create(form);
      }

      setForm(emptyForm);
      setEditingId(null);
      await reloadMembers();
    } catch (error) {
      setApiMessage(
        error instanceof Error ? error.message : "Falha ao salvar membro.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!canWrite) {
      setApiMessage("Seu perfil nao tem permissao para excluir membros.");
      return;
    }

    try {
      await membersService.remove(id);
      await reloadMembers();
    } catch (error) {
      setApiMessage(
        error instanceof Error ? error.message : "Falha ao excluir membro.",
      );
    }
  }

  function handleEdit(member: Member) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      email: member.email ?? "",
      phone: member.phone ?? "",
      role: member.role,
      password: "",
      isActive: member.isActive ?? false,
    });
  }

  const filtered = useMemo(
    () =>
      members.filter((member) =>
        `${member.name} ${member.email ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [members, search],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black text-navy-950">
            Membros e Cadastros
          </h1>
          <p className="text-slate-500">Gerencie membros, cargos e contatos.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 text-sm font-bold text-blue-700 rounded-full bg-blue-50">
            Dados: {source === "api" ? "backend real" : "indisponível"}
          </span>
          {canWrite ? (
            <Button>
              <Plus className="w-4 h-4" /> Novo membro
            </Button>
          ) : null}
        </div>
      </div>

      {apiMessage ? (
        <p className="p-4 text-sm font-semibold rounded-2xl bg-amber-50 text-amber-700">
          API: {apiMessage}. Exibindo somente dados recebidos do servidor.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total de membros"
          value={String(members.length)}
        />
        <StatCard
          icon={Users}
          title="Ativos"
          value={String(members.filter((m) => m.isActive !== false).length)}
          tone="teal"
        />
        <StatCard
          icon={Users}
          title="Inativos"
          value={String(members.filter((m) => m.isActive === false).length)}
          tone="red"
        />
        <StatCard
          icon={Users}
          title="Aniversariantes"
          value={String(
            members.filter((member) => Boolean(member.birthDate)).length,
          )}
          tone="amber"
        />
      </div>

      <Card>
        {canWrite ? (
          <form
            className="grid gap-3 p-4 mb-5 rounded-2xl bg-slate-50 md:grid-cols-6"
            onSubmit={handleSubmit}
          >
            <input
              className="px-4 py-3 border rounded-xl border-slate-200 md:col-span-2"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Nome"
              value={form.name}
            />
            <input
              className="px-4 py-3 border rounded-xl border-slate-200 md:col-span-2"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="E-mail"
              value={form.email}
            />
            <input
              className="px-4 py-3 border rounded-xl border-slate-200"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              placeholder="Telefone"
              value={form.phone}
            />

            <select
              className="px-4 py-3 border rounded-xl border-slate-200"
              disabled={!canWrite}
              // 1. O valor é lido do estado 'form'
              value={form.isActive.toString()}
              // 2. A mudança atualiza o estado 'form'
              onChange={(event) => {
                const isNowActive = event.target.value === "true";
                setForm((current) => ({
                  ...current,
                  isActive: isNowActive,
                }));
              }}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            <select
              className="px-4 py-3 border rounded-xl border-slate-200"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as Member["role"],
                }))
              }
              value={form.role}
            >
              <option value="MEMBRO">Membro</option>
              <option value="VOLUNTARIO">Voluntario</option>
              <option value="TESOUREIRO">Tesoureiro</option>
              <option value="PASTOR">Pastor</option>
              <option value="DIRETOR_PATRIMONIO">Diretor patrimonio</option>
              <option value="ADMIN">Admin</option>
            </select>
            <input
              className="px-4 py-3 border rounded-xl border-slate-200 md:col-span-2"
              disabled={!canWrite}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder={
                editingId ? "Nova senha opcional" : "Senha temporaria"
              }
              type="password"
              value={form.password}
            />
            <Button
              className="md:col-span-2"
              disabled={!canWrite || saving}
              type="submit"
            >
              {saving
                ? "Salvando..."
                : editingId
                  ? "Atualizar membro"
                  : "Criar membro"}
            </Button>
            {editingId ? (
              <Button
                className="md:col-span-1"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                type="button"
                variant="outline"
              >
                Cancelar edição
              </Button>
            ) : null}
          </form>
        ) : null}

        <div className="flex flex-col gap-3 mb-4 md:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              className="w-full py-3 pr-4 border outline-none rounded-xl border-slate-200 pl-11 focus:border-blue-500"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por nome, e-mail ou telefone..."
              value={search}
            />
          </label>
          <select className="px-4 py-3 border rounded-xl border-slate-200">
            <option>Todos os cargos</option>
            <option>Pastor</option>
            <option>Tesoureiro</option>
            <option>Membro</option>
          </select>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Carregando membros...
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState message="Nenhum membro encontrado." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Cargo</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr className="border-t border-slate-100" key={member.id}>
                    <td className="px-4 py-4">
                      <p className="font-bold text-navy-950">{member.name}</p>
                      <p className="text-slate-500">{member.email}</p>
                    </td>
                    <td className="px-4 py-4">{member.role}</td>
                    <td className="px-4 py-4">{member.phone ?? "-"}</td>
                    <td className="px-4 py-4">
                      <Badge
                        tone={member.isActive === false ? "slate" : "teal"}
                      >
                        {member.isActive === false ? "Inativo" : "Ativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-3 text-blue-700">
                        <Eye className="w-4 h-4" />
                        {canWrite ? (
                          <>
                            <button
                              aria-label="Editar membro"
                              onClick={() => handleEdit(member)}
                              type="button"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              aria-label="Excluir membro"
                              onClick={() => handleDelete(member.id)}
                              type="button"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
