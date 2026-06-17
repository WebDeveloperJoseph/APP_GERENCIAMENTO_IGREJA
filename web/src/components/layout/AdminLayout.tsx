import {
  BarChart3,
  Bell,
  CalendarDays,
  Cake,
  DollarSign,
  Home,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { Brand } from "@/components/layout/Brand";

const adminItems = [
  ["Inicio", "/admin", Home],
  ["Membros", "/admin/membros", Users],
  ["Eventos", "/admin/eventos", CalendarDays],
  ["Financas", "/admin/financas", DollarSign],
  ["Comunicacao", "/admin/comunicacao", MessageCircle],
  ["Relatorios", "/admin/relatorios", BarChart3],
  ["Aniversariantes", "/admin/aniversariantes", Cake],
  ["Agenda", "/admin/agenda", CalendarDays],
  ["Configuracoes", "/admin/configuracoes", Settings],
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 bg-gradient-to-b from-navy-950 to-navy-800 p-5 text-white lg:block">
        <Brand compact />
        <nav className="mt-10 space-y-2">
          {adminItems.map(([label, to, Icon]) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-blue-600 shadow-soft"
                    : "text-blue-100 hover:bg-white/10"
                }`
              }
              end={to === "/admin"}
              key={to}
              to={to}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white/10 p-4">
          <p className="font-bold">Central de ajuda</p>
          <p className="mt-1 text-sm text-blue-100">Tutoriais e suporte</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <div>
            <p className="text-sm text-slate-500">Igreja Batista Central</p>
            <h1 className="font-bold text-navy-950">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-navy-800" />
            <div className="text-right">
              <p className="text-sm font-bold text-navy-950">Pr. Lucas Silva</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
