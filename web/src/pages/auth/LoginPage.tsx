import { Church, LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { authService } from "@/services/authService";
import type { Role } from "@/types";

import { useAuth } from "@/contexts/AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  function resolveDestination(member: { isSuperAdmin?: boolean; role?: Role }) {
    if (member.isSuperAdmin) {
      return "/owner";
    }

    if (member.role === "MEMBRO") {
      return "/app";
    }

    return "/admin";
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      setUser(response.member);

      navigate(resolveDestination(response.member));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen px-5 py-10 bg-gradient-to-br from-navy-950 via-navy-900 to-teal-900 lg:grid-cols-2">
      <section className="items-center justify-center hidden text-white lg:flex">
        <div className="max-w-lg">
          <Church className="w-16 h-16 text-teal-300" />
          <h1 className="mt-6 text-5xl font-black">Igreja Connect</h1>
          <p className="mt-4 text-lg text-blue-100">
            Gestao moderna, segura e preparada para o crescimento da sua igreja.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-3xl font-black text-navy-950">Entrar</h2>
          <p className="mt-2 text-slate-500">Acesse sua igreja.</p>
          <form className="space-y-4 mt-7" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-bold text-navy-900">E-mail</span>
              <input
                className="w-full px-4 py-3 mt-2 border outline-none rounded-xl border-slate-200 focus:border-blue-500"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy-900">Senha</span>
              <input
                className="w-full px-4 py-3 mt-2 border outline-none rounded-xl border-slate-200 focus:border-blue-500"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>
            {error ? (
              <p className="p-3 text-sm font-semibold text-red-700 rounded-xl bg-red-50">
                {error}
              </p>
            ) : null}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
              <LogIn className="w-4 h-4" />
            </Button>
          </form>
          <Link
            className="block mt-5 text-sm font-bold text-center text-navy-800"
            to="/"
          >
            Voltar para o site
          </Link>
        </Card>
      </section>
    </main>
  );
}
