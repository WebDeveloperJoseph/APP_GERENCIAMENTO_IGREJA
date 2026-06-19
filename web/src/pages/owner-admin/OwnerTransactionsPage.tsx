import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useOwnerTransactions } from "@/hooks/useOwnerTransactions";

export function OwnerTransactionsPage() {
  const { transactions, loading, error } = useOwnerTransactions();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Transações"
        description="Visão global de pagamentos."
      />
      {loading ? (
        <Card>
          <div className="p-6 text-center text-slate-500">
            Carregando transações...
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
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Membro</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any) => (
                  <tr key={t.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-semibold">{t.id}</td>
                    <td className="px-4 py-4">{t.type}</td>
                    <td className="px-4 py-4">{t.category}</td>
                    <td className="px-4 py-4">R$ {t.value}</td>
                    <td className="px-4 py-4">{t.date}</td>
                    <td className="px-4 py-4">{t.member?.name ?? "-"}</td>
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
