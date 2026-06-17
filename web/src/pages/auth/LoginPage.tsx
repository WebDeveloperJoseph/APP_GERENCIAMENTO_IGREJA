import { Church, LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { authService } from "@/services/authService";

export function LoginPage() {
  const [email, setEmail] = useState("nfjosesouza@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      navigate(response.member.isSuperAdmin ? "/owner" : "/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-teal-900 px-5 py-10 lg:grid-cols-2">
      <section className="hidden items-center justify-center text-white lg:flex">
        <div className="max-w-lg">
          <Church className="h-16 w-16 text-teal-300" />
          <h1 className="mt-6 text-5xl font-black">Igreja Connect</h1>
          <p className="mt-4 text-lg text-blue-100">
            Gestão moderna, segura e preparada para o crescimento da sua igreja.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-3xl font-black text-navy-950">Entrar</h2>
          <p className="mt-2 text-slate-500">Acesse sua igreja ou painel SaaS.</p>
          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-bold text-navy-900">E-mail</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy-900">Senha</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            {error ? (
              <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
              <LogIn className="h-4 w-4" />
            </Button>
          </form>
          <Link className="mt-5 block text-center text-sm font-bold text-navy-800" to="/">
            Voltar para o site
          </Link>
        </Card>
      </section>
    </main>
  );
}
