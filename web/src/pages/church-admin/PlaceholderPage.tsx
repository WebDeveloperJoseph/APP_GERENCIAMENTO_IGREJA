import { Card } from "@/components/ui/Card";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Card>
      <h1 className="text-3xl font-black text-navy-950">{title}</h1>
      <p className="mt-2 text-slate-500">
        Tela preparada na navegação. A próxima etapa é conectar os formulários e
        regras específicas desta área.
      </p>
    </Card>
  );
}
