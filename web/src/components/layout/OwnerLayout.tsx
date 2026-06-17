import {
  BarChart3,
  Bell,
  Building2,
  CreditCard,
  Globe2,
  Headphones,
  Home,
  Megaphone,
  Plug,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const items = [
  ["Visao Geral", "/owner", Home],
  ["Igrejas", "/owner/igrejas", Building2],
  ["Assinaturas", "/owner/assinaturas", CreditCard],
  ["Financeiro", "/owner/financeiro", CreditCard],
  ["Planos", "/owner/planos", BarChart3],
  ["Leads & Onboarding", "/owner/leads", Users],
  ["Usuarios da Plataforma", "/owner/usuarios", Users],
  ["Suporte", "/owner/suporte", Headphones],
  ["Comunicados", "/owner/comunicados", Megaphone],
  ["Analytics", "/owner/analytics", BarChart3],
  ["Integracoes", "/owner/integracoes", Plug],
  ["Configuracoes", "/owner/configuracoes", Settings],
] as const;

export function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-navy-950 p-5 text-white xl:block">
        <div className="flex items-center gap-3">
          <Globe2 className="h-9 w-9 text-teal-400" />
          <div>
            <strong>Igreja Connect</strong>
            <p className="text-xs text-blue-100">SaaS Owner</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {items.map(([label, to, Icon]) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  isActive ? "bg-blue-600" : "text-blue-100 hover:bg-white/10"
                }`
              }
              end={to === "/owner"}
              key={to}
              to={to}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="xl:pl-72">
        <header className="flex h-20 items-center justify-between border-b bg-white px-6">
          <input
            className="w-full max-w-xl rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="Buscar igrejas, usuarios, planos, faturas..."
          />
          <div className="ml-4 flex items-center gap-4">
            <Bell className="h-5 w-5 text-navy-900" />
            <div>
              <p className="text-sm font-bold">Souza Jose</p>
              <p className="text-xs text-slate-500">Proprietario</p>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
