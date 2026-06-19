import { BarChart3, Bell, Building2, CreditCard, Globe2, Headphones, Home, LogOut, Megaphone, Menu, Plug, Settings, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

const items = [
  ["Visão Geral", "/owner", Home], ["Igrejas", "/owner/igrejas", Building2], ["Assinaturas", "/owner/assinaturas", CreditCard],
  ["Financeiro", "/owner/financeiro", CreditCard], ["Planos", "/owner/planos", BarChart3], ["Leads & Onboarding", "/owner/leads", Users],
  ["Usuários", "/owner/usuarios", Users], ["Suporte", "/owner/suporte", Headphones], ["Comunicados", "/owner/comunicados", Megaphone],
  ["Analytics", "/owner/analytics", BarChart3], ["Integrações", "/owner/integracoes", Plug], ["Configurações", "/owner/configuracoes", Settings],
] as const;

export function OwnerLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebar = <><div className="flex items-center gap-3"><Globe2 className="h-9 w-9 text-teal-400" /><div><strong>Igreja Connect</strong><p className="text-xs text-blue-100">Administração SaaS</p></div></div><nav className="mt-7 space-y-1">{items.map(([label, to, Icon]) => <NavLink onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-white/10"}`} end={to === "/owner"} key={to} to={to}><Icon className="h-4 w-4" />{label}</NavLink>)}</nav></>;

  return <div className="min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto bg-navy-950 p-5 text-white xl:block">{sidebar}</aside>
    {menuOpen && <div className="fixed inset-0 z-50 xl:hidden"><button aria-label="Fechar menu" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} /><aside className="relative h-full w-[min(86vw,20rem)] overflow-y-auto bg-navy-950 p-5 text-white shadow-2xl"><button aria-label="Fechar menu" className="absolute right-4 top-4" onClick={() => setMenuOpen(false)}><X /></button>{sidebar}</aside></div>}
    <div className="xl:pl-72"><header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b bg-white/95 px-4 backdrop-blur sm:px-6"><button aria-label="Abrir menu" className="rounded-xl border border-slate-200 p-2 xl:hidden" onClick={() => setMenuOpen(true)}><Menu /></button><input aria-label="Buscar na plataforma" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 sm:max-w-xl" placeholder="Buscar igrejas, usuários, planos..." /><div className="ml-auto flex items-center gap-2"><button aria-label="Notificações" className="rounded-xl p-2 hover:bg-slate-100"><Bell className="h-5 w-5" /></button><div className="hidden sm:block"><p className="text-sm font-bold">{user?.name}</p><p className="text-xs text-slate-500">Proprietário</p></div><button aria-label="Sair" title="Sair" className="rounded-xl p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={() => void authService.logout()}><LogOut className="h-5 w-5" /></button></div></header><main className="p-4 sm:p-5 lg:p-8">{children}</main></div>
  </div>;
}
