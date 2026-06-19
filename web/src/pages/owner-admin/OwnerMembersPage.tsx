import { User } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useOwnerMembers } from "@/hooks/useOwnerMembers";

export function OwnerMembersPage() {
  const { members, loading, error } = useOwnerMembers();

  return (
    <div className="space-y-6">
      <SectionHeader title="Membros" description="Visão global de membros." />
      {loading ? (
        <Card>
          <div className="p-6 text-center text-slate-500">
            Carregando membros...
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="p-6 text-center text-red-700 bg-red-50 rounded-xl">
            Erro: {String(error)}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Papel</th>
                  <th className="px-4 py-3">Igreja</th>
                  <th className="px-4 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m: any) => (
                  <tr key={m.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-semibold">{m.name}</td>
                    <td className="px-4 py-4">{m.email}</td>
                    <td className="px-4 py-4">{m.phone}</td>
                    <td className="px-4 py-4">{m.role}</td>
                    <td className="px-4 py-4">{m.churchId ?? "-"}</td>
                    <td className="px-4 py-4">{m.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
