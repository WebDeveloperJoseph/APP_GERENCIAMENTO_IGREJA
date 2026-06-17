import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { OwnerLayout } from "@/components/layout/OwnerLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AdminDashboardPage } from "@/pages/church-admin/AdminDashboardPage";
import { AgendaPage } from "@/pages/church-admin/AgendaPage";
import { BirthdaysPage } from "@/pages/church-admin/BirthdaysPage";
import { CommunicationPage } from "@/pages/church-admin/CommunicationPage";
import { EventsPage } from "@/pages/church-admin/EventsPage";
import { FinancePage } from "@/pages/church-admin/FinancePage";
import { MembersPage } from "@/pages/church-admin/MembersPage";
import { ReportsPage } from "@/pages/church-admin/ReportsPage";
import { SettingsPage } from "@/pages/church-admin/SettingsPage";
import { MemberHomePage } from "@/pages/member-web/MemberHomePage";
import { OwnerBillingPage } from "@/pages/owner-admin/OwnerBillingPage";
import { OwnerChurchesPage } from "@/pages/owner-admin/OwnerChurchesPage";
import { OwnerDashboardPage } from "@/pages/owner-admin/OwnerDashboardPage";
import { OwnerSettingsPage } from "@/pages/owner-admin/OwnerSettingsPage";
import { OwnerSimplePage } from "@/pages/owner-admin/OwnerSimplePage";
import { OwnerSubscriptionsPage } from "@/pages/owner-admin/OwnerSubscriptionsPage";
import { OwnerSupportPage } from "@/pages/owner-admin/OwnerSupportPage";
import { ChurchSignupPage } from "@/pages/public/ChurchSignupPage";
import { LandingPage } from "@/pages/public/LandingPage";
import { getToken } from "@/services/api";
import { hasRole, isSuperAdmin } from "@/utils/permissions";
import type { Role } from "@/types";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const demoMode = import.meta.env.VITE_DEMO_MODE !== "false";

  if (getToken() || demoMode) {
    return children;
  }

  return <Navigate replace to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <AdminLayout>{children}</AdminLayout>
    </PrivateRoute>
  );
}

function RoleRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: Role[];
}) {
  const demoMode = import.meta.env.VITE_DEMO_MODE !== "false";

  if (demoMode || hasRole(roles)) {
    return <AdminRoute>{children}</AdminRoute>;
  }

  return <Navigate replace to="/admin" />;
}

function OwnerRoute({ children }: { children: React.ReactNode }) {
  const demoMode = import.meta.env.VITE_DEMO_MODE !== "false";

  if (!demoMode && !isSuperAdmin()) {
    return <Navigate replace to="/admin" />;
  }

  return (
    <PrivateRoute>
      <OwnerLayout>{children}</OwnerLayout>
    </PrivateRoute>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<ChurchSignupPage />} path="/cadastro-igreja" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<MemberHomePage />} path="/app" />

      <Route element={<AdminRoute><AdminDashboardPage /></AdminRoute>} path="/admin" />
      <Route element={<RoleRoute roles={["ADMIN"]}><MembersPage /></RoleRoute>} path="/admin/membros" />
      <Route element={<RoleRoute roles={["PASTOR", "ADMIN"]}><EventsPage /></RoleRoute>} path="/admin/eventos" />
      <Route element={<RoleRoute roles={["TESOUREIRO", "ADMIN"]}><FinancePage /></RoleRoute>} path="/admin/financas" />
      <Route element={<AdminRoute><CommunicationPage /></AdminRoute>} path="/admin/comunicacao" />
      <Route element={<AdminRoute><ReportsPage /></AdminRoute>} path="/admin/relatorios" />
      <Route element={<AdminRoute><BirthdaysPage /></AdminRoute>} path="/admin/aniversariantes" />
      <Route element={<AdminRoute><AgendaPage /></AdminRoute>} path="/admin/agenda" />
      <Route element={<AdminRoute><SettingsPage /></AdminRoute>} path="/admin/configuracoes" />

      <Route element={<OwnerRoute><OwnerDashboardPage /></OwnerRoute>} path="/owner" />
      <Route element={<OwnerRoute><OwnerChurchesPage /></OwnerRoute>} path="/owner/igrejas" />
      <Route element={<OwnerRoute><OwnerSubscriptionsPage /></OwnerRoute>} path="/owner/assinaturas" />
      <Route element={<OwnerRoute><OwnerBillingPage /></OwnerRoute>} path="/owner/financeiro" />
      <Route element={<OwnerRoute><OwnerSimplePage title="Planos" /></OwnerRoute>} path="/owner/planos" />
      <Route element={<OwnerRoute><OwnerSimplePage title="Leads & Onboarding" /></OwnerRoute>} path="/owner/leads" />
      <Route element={<OwnerRoute><OwnerSimplePage title="Usuários da Plataforma" /></OwnerRoute>} path="/owner/usuarios" />
      <Route element={<OwnerRoute><OwnerSupportPage /></OwnerRoute>} path="/owner/suporte" />
      <Route element={<OwnerRoute><OwnerSimplePage title="Comunicados" /></OwnerRoute>} path="/owner/comunicados" />
      <Route element={<OwnerRoute><OwnerSimplePage title="Analytics" /></OwnerRoute>} path="/owner/analytics" />
      <Route element={<OwnerRoute><OwnerSimplePage title="Integrações" /></OwnerRoute>} path="/owner/integracoes" />
      <Route element={<OwnerRoute><OwnerSettingsPage /></OwnerRoute>} path="/owner/configuracoes" />

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
