import { Building2, Eye, MoreHorizontal, Plus } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ownerChurches } from "@/data/mockData";

export function OwnerChurchesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Nova igreja
          </Button>
        }
        description="Gerencie tenants, status, plano e responsáveis por igreja."
        title="Igrejas"
      />
      <Card>
        <div className="mb-4 flex gap-3">
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
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
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <strong>{church.name}</strong>
                    </div>
                  </td>
                  <td className="px-4 py-4"><Badge>{church.plan}</Badge></td>
                  <td className="px-4 py-4">
                    <Badge tone={church.status === "Atrasada" ? "red" : church.status === "Em teste" ? "amber" : "teal"}>
                      {church.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">{church.city}</td>
                  <td className="px-4 py-4">{church.admin}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3 text-blue-700">
                      <Eye className="h-4 w-4" />
                      <MoreHorizontal className="h-4 w-4" />
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
