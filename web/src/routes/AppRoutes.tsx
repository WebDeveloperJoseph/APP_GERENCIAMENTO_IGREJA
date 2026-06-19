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
import { OwnerMembersPage } from "@/pages/owner-admin/OwnerMembersPage";
import { OwnerTransactionsPage } from "@/pages/owner-admin/OwnerTransactionsPage";
import { ChurchSignupPage } from "@/pages/public/ChurchSignupPage";
import { LandingPage } from "@/pages/public/LandingPage";
import { getStoredUser, getToken } from "@/services/api";
import { hasRole, isSuperAdmin } from "@/utils/permissions";
import { useAuth } from "@/contexts/AuthContext";
import type { Member, Role } from "@/types";

function isAuthenticated() {
  // Support both token-based and cookie-based auth.
  const token = getToken();
  const stored = getStoredUser<Member>();

  const validated =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("igreja_connect_validated") === "1";

  const useCredentials =
    (import.meta.env.VITE_API_USE_CREDENTIALS ?? "false") === "true";

  if (token) return Boolean(stored && validated);

  if (useCredentials) return Boolean(stored && validated);

  return false;
}

function hasAdminAccess() {
  return hasRole(["ADMIN", "PASTOR", "TESOUREIRO", "DIRETOR_PATRIMONIO"]);
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true";
  const { user, authChecked } = useAuth();

  if (!authChecked) return null;

  if (user || demoMode) return children;

  return <Navigate replace to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true";
  const { user, authChecked } = useAuth();

  if (!authChecked) return null;

  if (!demoMode && !user) return <Navigate replace to="/login" />;

  const allowed =
    demoMode ||
    Boolean(
      user?.isSuperAdmin ||
      ["ADMIN", "PASTOR", "TESOUREIRO", "DIRETOR_PATRIMONIO"].includes(
        user?.role ?? "",
      ),
    );

  if (!allowed) return <Navigate replace to="/app" />;

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
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true";
  const { user, authChecked } = useAuth();

  if (!authChecked) return null;

  if (!demoMode && !user) return <Navigate replace to="/login" />;

  const ok =
    demoMode ||
    Boolean(user?.isSuperAdmin || roles.includes(user?.role as Role));

  if (ok) return <AdminRoute>{children}</AdminRoute>;

  return <Navigate replace to="/admin" />;
}

function OwnerRoute({ children }: { children: React.ReactNode }) {
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true";
  const { user, authChecked } = useAuth();

  if (!authChecked) return null;

  if (!demoMode && !user) return <Navigate replace to="/login" />;

  if (!demoMode && !user?.isSuperAdmin) return <Navigate replace to="/admin" />;

  return (
    <PrivateRoute>
      <OwnerLayout>{children}</OwnerLayout>
    </PrivateRoute>
  );
}

export function AppRoutes() {
  const currentUser = getStoredUser<Member>();
  const loginRedirect = currentUser?.isSuperAdmin
    ? "/owner"
    : currentUser?.role === "MEMBRO"
      ? "/app"
      : "/admin";

  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<ChurchSignupPage />} path="/cadastro-igreja" />
      <Route
        element={
          isAuthenticated() ? (
            <Navigate replace to={loginRedirect} />
          ) : (
            <LoginPage />
          )
        }
        path="/login"
      />
      <Route
        element={
          <PrivateRoute>
            <MemberHomePage />
          </PrivateRoute>
        }
        path="/app"
      />

      <Route
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
        path="/admin"
      />
      <Route
        element={
          <RoleRoute roles={["ADMIN", "PASTOR"]}>
            <MembersPage />
          </RoleRoute>
        }
        path="/admin/membros"
      />
      <Route
        element={
          <RoleRoute roles={["PASTOR", "ADMIN"]}>
            <EventsPage />
          </RoleRoute>
        }
        path="/admin/eventos"
      />
      <Route
        element={
          <RoleRoute roles={["TESOUREIRO", "ADMIN", "PASTOR"]}>
            <FinancePage />
          </RoleRoute>
        }
        path="/admin/financas"
      />
      <Route
        element={
          <AdminRoute>
            <CommunicationPage />
          </AdminRoute>
        }
        path="/admin/comunicacao"
      />
      <Route
        element={
          <AdminRoute>
            <ReportsPage />
          </AdminRoute>
        }
        path="/admin/relatorios"
      />
      <Route
        element={
          <AdminRoute>
            <BirthdaysPage />
          </AdminRoute>
        }
        path="/admin/aniversariantes"
      />
      <Route
        element={
          <AdminRoute>
            <AgendaPage />
          </AdminRoute>
        }
        path="/admin/agenda"
      />
      <Route
        element={
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        }
        path="/admin/configuracoes"
      />

      <Route
        element={
          <OwnerRoute>
            <OwnerDashboardPage />
          </OwnerRoute>
        }
        path="/owner"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerChurchesPage />
          </OwnerRoute>
        }
        path="/owner/igrejas"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSubscriptionsPage />
          </OwnerRoute>
        }
        path="/owner/assinaturas"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerBillingPage />
          </OwnerRoute>
        }
        path="/owner/financeiro"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSimplePage title="Planos" />
          </OwnerRoute>
        }
        path="/owner/planos"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSimplePage title="Leads & Onboarding" />
          </OwnerRoute>
        }
        path="/owner/leads"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSimplePage title="Usuários da Plataforma" />
          </OwnerRoute>
        }
        path="/owner/usuarios"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerMembersPage />
          </OwnerRoute>
        }
        path="/owner/membros"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerTransactionsPage />
          </OwnerRoute>
        }
        path="/owner/transacoes"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSupportPage />
          </OwnerRoute>
        }
        path="/owner/suporte"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSimplePage title="Comunicados" />
          </OwnerRoute>
        }
        path="/owner/comunicados"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSimplePage title="Analytics" />
          </OwnerRoute>
        }
        path="/owner/analytics"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSimplePage title="Integrações" />
          </OwnerRoute>
        }
        path="/owner/integracoes"
      />
      <Route
        element={
          <OwnerRoute>
            <OwnerSettingsPage />
          </OwnerRoute>
        }
        path="/owner/configuracoes"
      />

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
