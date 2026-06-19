import { Building2, Eye, MoreHorizontal, Plus } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useOwnerChurches } from "@/hooks/useOwnerChurches";
import { useState } from "react";
import { ownerService } from "@/services/ownerService";

export function OwnerChurchesPage() {
  const { ownerChurches, loading, error, refetch } = useOwnerChurches();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    churchName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    responsibleName: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setFormError(null);
    try {
      await ownerService.create(form);
      setOpen(false);
      await refetch();
    } catch (err) {
      setFormError(String(err));
    }
  }
  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          actions={
            <Button>
              <Plus className="w-4 h-4" />
              Nova igreja
            </Button>
          }
          description="Gerencie tenants, status, plano e responsáveis por igreja."
          title="Igrejas"
        />
        <Card>
          <div className="p-6 text-center text-slate-500">
            Carregando igrejas...
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader
          actions={
            <Button>
              <Plus className="w-4 h-4" />
              Nova igreja
            </Button>
          }
          description="Gerencie tenants, status, plano e responsáveis por igreja."
          title="Igrejas"
        />
        <Card>
          <div className="p-6 text-center text-red-700 bg-red-50 rounded-xl">
            Erro ao carregar igrejas: {String(error)}
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" />
              Nova igreja
            </Button>
          </>
        }
        description="Gerencie tenants, status, plano e responsáveis por igreja."
        title="Igrejas"
      />
      <Card>
        {open && (
          <form onSubmit={handleCreate} className="space-y-4 p-6">
            {formError && (
              <div className="p-3 text-red-700 bg-red-50 rounded">
                {formError}
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="w-full px-4 py-3 border rounded-xl border-slate-200"
                placeholder="Nome da igreja"
                value={form.churchName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, churchName: e.target.value })
                }
                required
              />
              <input
                className="w-full px-4 py-3 border rounded-xl border-slate-200"
                placeholder="Cidade"
                value={form.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, city: e.target.value })
                }
              />
              <input
                className="w-full px-4 py-3 border rounded-xl border-slate-200"
                placeholder="Estado"
                value={form.state}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, state: e.target.value })
                }
              />
              <input
                className="w-full px-4 py-3 border rounded-xl border-slate-200"
                placeholder="Telefone"
                value={form.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="w-full px-4 py-3 border rounded-xl border-slate-200"
                placeholder="E-mail do admin"
                value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
              <input
                className="w-full px-4 py-3 border rounded-xl border-slate-200"
                placeholder="Nome do responsável"
                value={form.responsibleName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, responsibleName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <input
                className="w-full px-4 py-3 border rounded-xl border-slate-200"
                placeholder="Senha inicial"
                type="password"
                value={form.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button type="submit">Criar igreja</Button>
            </div>
          </form>
        )}
        <div className="flex gap-3 mb-4">
          <input
            className="w-full px-4 py-3 border rounded-xl border-slate-200"
            placeholder="Buscar por igreja, cidade ou responsável..."
          />
          <Button variant="outline">Filtrar</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Igreja</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ownerChurches.map((church) => (
                <tr className="border-t border-slate-100" key={church.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 text-blue-700 rounded-2xl bg-blue-50">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <strong>{church.name}</strong>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge>{church.plan}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      tone={
                        church.status === "Atrasada"
                          ? "red"
                          : church.status === "Em teste"
                            ? "amber"
                            : "teal"
                      }
                    >
                      {church.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">{church.city}</td>
                  <td className="px-4 py-4">{church.admin}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3 text-blue-700">
                      <Eye className="w-4 h-4" />
                      <MoreHorizontal className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
