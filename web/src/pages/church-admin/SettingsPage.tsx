import { Building2, KeyRound, Palette, Save, ShieldCheck, UserCog } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <Button>
            <Save className="h-4 w-4" />
            Salvar alterações
          </Button>
        }
        description="Configurações da igreja, identidade visual, permissões e segurança."
        title="Configurações"
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="mb-5 flex items-center gap-2 font-bold text-navy-950">
            <Building2 className="h-5 w-5 text-blue-700" />
            Dados da igreja
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Nome da igreja", "Igreja Batista Central"],
              ["E-mail", "contato@igrejacentral.com.br"],
              ["Telefone", "(11) 99999-9999"],
              ["Cidade", "São Paulo"],
            ].map(([label, value]) => (
              <label key={label}>
                <span className="text-sm font-bold text-navy-900">{label}</span>
                <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" defaultValue={value} />
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 flex items-center gap-2 font-bold text-navy-950">
            <Palette className="h-5 w-5 text-teal-600" />
            Identidade visual
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {["#06295F", "#0EA5A6", "#F8FAFC"].map((color) => (
              <div className="rounded-2xl border border-slate-100 p-3" key={color}>
                <div className="h-16 rounded-xl" style={{ background: color }} />
                <p className="mt-2 text-center text-xs font-bold">{color}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          [UserCog, "Permissões", "Controle cargos e acessos da equipe."],
          [KeyRound, "Segurança", "Política de senha e sessões."],
          [ShieldCheck, "Multi-tenant", "Igreja isolada por tenant no backend."],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)}>
            <Icon className="h-8 w-8 text-blue-700" />
            <h2 className="mt-4 font-bold text-navy-950">{String(title)}</h2>
            <p className="mt-2 text-sm text-slate-500">{String(description)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
