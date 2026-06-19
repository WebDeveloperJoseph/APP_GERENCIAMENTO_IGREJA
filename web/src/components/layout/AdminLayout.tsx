import { BarChart3, Bell, CalendarDays, Cake, DollarSign, Home, LogOut, Menu, MessageCircle, Settings, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { Brand } from "@/components/layout/Brand";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

const adminItems = [
  ["Início", "/admin", Home], ["Membros", "/admin/membros", Users], ["Eventos", "/admin/eventos", CalendarDays],
  ["Finanças", "/admin/financas", DollarSign], ["Comunicação", "/admin/comunicacao", MessageCircle], ["Relatórios", "/admin/relatorios", BarChart3],
  ["Aniversariantes", "/admin/aniversariantes", Cake], ["Agenda", "/admin/agenda", CalendarDays], ["Configurações", "/admin/configuracoes", Settings],
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = <nav className="mt-8 space-y-1">{adminItems.map(([label, to, Icon]) => <NavLink onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-soft" : "text-blue-100 hover:bg-white/10"}`} end={to === "/admin"} key={to} to={to}><Icon className="h-5 w-5" />{label}</NavLink>)}</nav>;

  return <div className="min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-gradient-to-b from-navy-950 to-navy-800 p-5 text-white lg:block"><Brand compact />{navigation}</aside>
    {menuOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Fechar menu" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} /><aside className="relative h-full w-[min(86vw,20rem)] bg-gradient-to-b from-navy-950 to-navy-800 p-5 text-white shadow-2xl"><div className="flex items-center justify-between"><Brand compact /><button aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><X /></button></div>{navigation}</aside></div>}
    <div className="lg:pl-72">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
        <div className="flex items-center gap-3"><button aria-label="Abrir menu" className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setMenuOpen(true)}><Menu /></button><div><p className="hidden text-sm text-slate-500 sm:block">Gestão da sua igreja</p><h1 className="font-bold text-navy-950">Painel Administrativo</h1></div></div>
        <div className="flex items-center gap-3"><button aria-label="Notificações" className="rounded-xl p-2 hover:bg-slate-100"><Bell className="h-5 w-5" /></button><div className="hidden text-right sm:block"><p className="text-sm font-bold">{user?.name}</p><p className="text-xs text-slate-500">{user?.role}</p></div><button aria-label="Sair" title="Sair" className="rounded-xl p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => void authService.logout()}><LogOut className="h-5 w-5" /></button></div>
      </header><main className="p-4 sm:p-5 lg:p-8">{children}</main>
    </div>
  </div>;
}
