import { KeyRound, Plug, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function OwnerSettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={<Button><Save className="h-4 w-4" /> Salvar</Button>}
        description="Parâmetros globais da plataforma, integrações e segurança."
        title="Configurações do SaaS"
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          [ShieldCheck, "Segurança", "JWT, sessões e políticas globais."],
          [Plug, "Integrações", "Gateway, e-mail, WhatsApp e storage."],
          [SlidersHorizontal, "Feature flags", "Libere módulos por plano."],
          [KeyRound, "Acesso owner", "Usuários com permissão global."],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)}>
            <Icon className="h-8 w-8 text-blue-700" />
            <h2 className="mt-4 font-bold text-navy-950">{String(title)}</h2>
            <p className="mt-2 text-sm text-slate-500">{String(description)}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="mb-4 font-bold text-navy-950">Ambiente</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-sm font-bold">URL da API</span>
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" defaultValue="https://app-gerenciamento-igreja.onrender.com" />
          </label>
          <label>
            <span className="text-sm font-bold">Modo demonstração</span>
            <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </label>
        </div>
      </Card>
    </div>
  );
}
