import { ArrowRight, Check, Lock, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { authService } from "@/services/authService";
import type { ChurchLead } from "@/types";

const initialForm: ChurchLead & { confirmPassword: string } = {
  churchName: "",
  cnpj: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  membersCount: 0,
  responsibleName: "",
  password: "",
  confirmPassword: "",
};

export function ChurchSignupPage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      setMessage("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const { confirmPassword, ...payload } = form;

    try {
      const response = await authService.registerChurch(payload);
      setMessage(response.message ?? "Cadastro enviado com sucesso.");
      setForm(initialForm);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel cadastrar a igreja.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-teal-50">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="mx-auto mb-8 grid max-w-3xl grid-cols-3 items-center gap-3 text-center text-sm font-semibold">
          {["Dados da Igreja", "Plano", "Confirmação"].map((step, index) => (
            <div className="text-navy-800" key={step}>
              <span className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full ${index === 0 ? "bg-navy-800 text-white" : "bg-white text-navy-800"}`}>
                {index + 1}
              </span>
              {step}
            </div>
          ))}
        </div>

        <Card className="grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <h1 className="text-4xl font-black text-navy-950">
              Crie a conta da sua igreja
            </h1>
            <p className="mt-3 max-w-xl text-slate-600">
              Preencha os dados para começar a usar a plataforma completa.
            </p>
            <form className="mt-7 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              {[
                ["churchName", "Nome da igreja *", "Ex.: Igreja Batista Central"],
                ["cnpj", "CNPJ opcional", "12.345.678/0001-90"],
                ["email", "E-mail da igreja *", "contato@suaigreja.com.br"],
                ["phone", "Telefone / WhatsApp *", "(11) 99999-9999"],
                ["city", "Cidade *", "São Paulo"],
                ["state", "Estado *", "SP"],
                ["membersCount", "Número de membros *", "120"],
                ["responsibleName", "Nome do responsável *", "João Silva"],
                ["password", "Senha *", "Crie uma senha segura"],
                ["confirmPassword", "Confirmar senha *", "Confirme sua senha"],
              ].map(([name, label, placeholder]) => (
                <label className="block" key={name}>
                  <span className="text-sm font-bold text-navy-900">{label}</span>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder={placeholder}
                    type={name.toLowerCase().includes("password") ? "password" : name === "membersCount" ? "number" : "text"}
                    value={String(form[name as keyof typeof form])}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [name]:
                          name === "membersCount"
                            ? Number(event.target.value)
                            : event.target.value,
                      }))
                    }
                  />
                </label>
              ))}
              <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-600">
                <input checked readOnly type="checkbox" />
                Li e aceito os Termos de Uso e a Política de Privacidade.
              </label>
              {message ? (
                <p className="md:col-span-2 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-700">
                  {message}
                </p>
              ) : null}
              <Button className="md:col-span-2" disabled={loading} type="submit">
                {loading ? "Enviando..." : "Finalizar cadastro"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </section>

          <aside className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6">
            <p className="text-sm font-bold text-amber-600">Mais escolhido</p>
            <h2 className="mt-2 text-2xl font-black text-navy-950">
              Plano Premium
            </h2>
            <p className="mt-2 text-slate-600">Tudo o que sua igreja precisa para crescer.</p>
            <p className="mt-5 text-4xl font-black text-navy-950">
              R$ 199<span className="text-base font-medium">/mês</span>
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-700">
              {["Membros ilimitados", "Eventos e presença", "Finanças e dízimos", "Relatórios", "App da igreja", "Suporte humanizado"].map((item) => (
                <span className="flex items-center gap-2" key={item}>
                  <Check className="h-4 w-4 text-teal-600" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-white p-4">
              <ShieldCheck className="h-6 w-6 text-teal-600" />
              <p className="mt-2 font-bold">Teste grátis de 7 dias</p>
              <p className="text-sm text-slate-500">Sem compromisso. Cancele quando quiser.</p>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Lock className="h-4 w-4" />
              Não cobramos nada agora.
            </p>
            <Link className="mt-5 block text-sm font-bold text-navy-800" to="/login">
              Já tenho conta
            </Link>
          </aside>
        </Card>
      </main>
    </div>
  );
}
