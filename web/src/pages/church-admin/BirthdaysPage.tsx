import { Cake, Gift, MessageCircle, Phone } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockMembers } from "@/data/mockData";

function getBirthDay(date?: string | null) {
  if (!date) {
    return "--";
  }

  return String(new Date(date).getDate()).padStart(2, "0");
}

export function BirthdaysPage() {
  const members = [...mockMembers].sort((a, b) =>
    getBirthDay(a.birthDate).localeCompare(getBirthDay(b.birthDate)),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        actions={<Button variant="outline">Enviar parabéns em massa</Button>}
        description="Acompanhe aniversários e fortaleça o cuidado pastoral."
        title="Aniversariantes"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {members.map((member) => (
          <Card key={member.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Dia</p>
                <strong className="text-4xl text-navy-950">{getBirthDay(member.birthDate)}</strong>
                <p className="text-sm font-bold text-teal-600">MAIO</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <Cake className="h-6 w-6" />
              </div>
            </div>
            <h2 className="mt-5 font-bold text-navy-950">{member.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="teal">{member.role}</Badge>
              <Badge>{member.phone ?? "Sem telefone"}</Badge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button className="py-2" variant="outline">
                <Phone className="h-4 w-4" />
                Ligar
              </Button>
              <Button className="py-2" variant="secondary">
                <MessageCircle className="h-4 w-4" />
                Mensagem
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-teal-600" />
          <div>
            <h2 className="font-bold text-navy-950">Sugestão pastoral</h2>
            <p className="text-sm text-slate-500">
              Gere uma lista semanal e distribua entre líderes para contato pessoal.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
