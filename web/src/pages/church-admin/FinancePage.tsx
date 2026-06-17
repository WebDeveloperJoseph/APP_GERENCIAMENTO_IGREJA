import { ArrowDownCircle, ArrowUpCircle, Filter, Plus } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { RevenueChart } from "@/components/charts/RevenueChart";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { transactionsService } from "@/services/transactionsService";
import type { DataSource, Transaction } from "@/types";
import { canManageFinance } from "@/utils/permissions";

const emptyTransactionForm = {
  type: "ENTRADA" as Transaction["type"],
  category: "DIZIMO",
  value: "",
  date: "",
  description: "",
};

export function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTransactionForm);
  const [saving, setSaving] = useState(false);
  const canWrite = canManageFinance();

  function reloadTransactions() {
    return transactionsService.listWithSource().then((result) => {
      setTransactions(result.data);
      setSource(result.source);
      setApiMessage(result.error ?? null);
    });
  }

  useEffect(() => {
    reloadTransactions();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!canWrite) {
      setApiMessage("Seu perfil nao tem permissao para gerenciar financas.");
      return;
    }

    setSaving(true);

    try {
      await transactionsService.create({
        type: form.type,
        category: form.category,
        value: Number(form.value),
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        description: form.description,
      });
      setForm(emptyTransactionForm);
      await reloadTransactions();
    } catch (error) {
      setApiMessage(
        error instanceof Error ? error.message : "Falha ao criar lancamento.",
      );
    } finally {
      setSaving(false);
    }
  }

  const totals = useMemo(
    () => ({
      income: transactions.filter((t) => t.type === "ENTRADA").reduce((acc, t) => acc + t.value, 0),
      expense: transactions.filter((t) => t.type === "SAIDA").reduce((acc, t) => acc + t.value, 0),
    }),
    [transactions],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Finanças</h1>
          <p className="text-slate-500">Entradas, saídas, dízimos, ofertas e despesas.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            Dados: {source === "api" ? "backend real" : "mock fallback"}
          </span>
          <Button>
            <Plus className="h-4 w-4" /> Novo lançamento
          </Button>
        </div>
      </div>
      {apiMessage ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          API: {apiMessage}. Exibindo movimentações demonstrativas temporariamente.
        </p>
      ) : null}
      <Card>
        <form className="grid gap-3 md:grid-cols-6" onSubmit={handleSubmit}>
          <select
            className="rounded-xl border border-slate-200 px-4 py-3"
            disabled={!canWrite}
            onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as Transaction["type"] }))}
            value={form.type}
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saida</option>
          </select>
          <select
            className="rounded-xl border border-slate-200 px-4 py-3"
            disabled={!canWrite}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            value={form.category}
          >
            <option value="DIZIMO">Dizimo</option>
            <option value="OFERTA">Oferta</option>
            <option value="ALUGUEL">Aluguel</option>
            <option value="ENERGIA">Energia</option>
            <option value="AGUA">Agua</option>
            <option value="MANUTENCAO">Manutencao</option>
            <option value="OUTROS">Outros</option>
          </select>
          <input
            className="rounded-xl border border-slate-200 px-4 py-3"
            disabled={!canWrite}
            onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
            placeholder="Valor"
            type="number"
            value={form.value}
          />
          <input
            className="rounded-xl border border-slate-200 px-4 py-3"
            disabled={!canWrite}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
            type="date"
            value={form.date}
          />
          <input
            className="rounded-xl border border-slate-200 px-4 py-3"
            disabled={!canWrite}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Descricao"
            value={form.description}
          />
          <Button disabled={!canWrite || saving} type="submit">
            {saving ? "Salvando..." : "Registrar"}
          </Button>
        </form>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={ArrowUpCircle} title="Entradas" value={`R$ ${totals.income.toLocaleString("pt-BR")}`} tone="teal" />
        <StatCard icon={ArrowDownCircle} title="Saídas" value={`R$ ${totals.expense.toLocaleString("pt-BR")}`} tone="red" />
        <StatCard icon={Filter} title="Saldo" value={`R$ ${(totals.income - totals.expense).toLocaleString("pt-BR")}`} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <h2 className="font-bold text-navy-950">Arrecadações</h2>
          <RevenueChart />
        </Card>
        <Card>
          <h2 className="mb-4 font-bold text-navy-950">Últimas movimentações</h2>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4" key={transaction.id}>
                <div>
                  <p className="font-bold">{transaction.description ?? transaction.category}</p>
                  <p className="text-sm text-slate-500">{transaction.category}</p>
                </div>
                <div className="text-right">
                  <Badge tone={transaction.type === "ENTRADA" ? "teal" : "red"}>{transaction.type}</Badge>
                  <p className="mt-1 font-bold">R$ {transaction.value.toLocaleString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
