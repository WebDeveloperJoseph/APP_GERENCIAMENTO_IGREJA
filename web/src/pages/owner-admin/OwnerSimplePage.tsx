import { BarChart3, Megaphone, Plug, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

const iconMap = {
  Planos: BarChart3,
  "Leads & Onboarding": Users,
  "Usuários da Plataforma": Users,
  Comunicados: Megaphone,
  Analytics: BarChart3,
  Integrações: Plug,
};

export function OwnerSimplePage({ title }: { title: keyof typeof iconMap }) {
  const Icon = iconMap[title];

  return (
    <div className="space-y-6">
      <SectionHeader
        actions={<Button variant="outline">Nova ação</Button>}
        description="Área estrutural preparada para a operação do SaaS."
        title={title}
      />
      <div className="grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <Icon className="h-8 w-8 text-blue-700" />
            <h2 className="mt-4 font-bold text-navy-950">{title} #{item}</h2>
            <p className="mt-2 text-sm text-slate-500">
              Bloco pronto para receber dados reais do backend owner quando a API existir.
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
