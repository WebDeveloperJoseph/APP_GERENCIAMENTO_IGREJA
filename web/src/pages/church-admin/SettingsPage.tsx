import {
  Building2,
  CreditCard,
  ExternalLink,
  KeyRound,
  Palette,
  Save,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { authService } from "@/services/authService";
import { billingService } from "@/services/billingService";
import type { BillingOverview } from "@/types";

export function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    authService.me().then((member) => {
      setProfile({
        name: member.name ?? "",
        email: member.email ?? "",
        phone: member.phone ?? "",
        birthDate: member.birthDate
          ? new Date(member.birthDate).toISOString().slice(0, 10)
          : "",
      });
    });
    billingService.overview().then(setBilling).catch(() => null);
  }, []);

  async function handleCheckout(planId: string) {
    setCheckoutLoading(planId);
    setMessage(null);
    try {
      const checkout = await billingService.createCheckout(planId);
      window.location.assign(checkout.link);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha ao iniciar checkout.");
      setCheckoutLoading(null);
    }
  }

  async function handleSaveProfile(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await authService.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        birthDate: profile.birthDate || null,
      });

      setMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Falha ao atualizar perfil.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();
    if (!oldPassword || !newPassword) {
      setMessage("Preencha senha atual e nova senha.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await authService.changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setMessage("Senha alterada com sucesso.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Falha ao alterar senha.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        actions={
          <div className="flex items-center gap-2">
            <Button disabled={saving} form="profile-form" type="submit">
              <Save className="h-4 w-4" />
              Salvar alterações
            </Button>
            <Button
              onClick={async () => {
                try {
                  await authService.logout();
                } catch (e) {
                  // logout always clears session; errors are non-fatal here
                }
              }}
              variant="outline"
            >
              Sair
            </Button>
          </div>
        }
        description="Configurações da igreja, identidade visual, permissões e segurança."
        title="Configurações"
      />

      {message ? (
        <p className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">
          {message}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="mb-5 flex items-center gap-2 font-bold text-navy-950">
            <Building2 className="h-5 w-5 text-blue-700" />
            Meu perfil
          </h2>
          <form
            className="grid gap-4 md:grid-cols-2"
            id="profile-form"
            onSubmit={handleSaveProfile}
          >
            <label>
              <span className="text-sm font-bold text-navy-900">Nome</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                value={profile.name}
              />
            </label>
            <label>
              <span className="text-sm font-bold text-navy-900">E-mail</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                value={profile.email}
              />
            </label>
            <label>
              <span className="text-sm font-bold text-navy-900">Telefone</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                value={profile.phone}
              />
            </label>
            <label>
              <span className="text-sm font-bold text-navy-900">
                Data de nascimento
              </span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    birthDate: event.target.value,
                  }))
                }
                type="date"
                value={profile.birthDate}
              />
            </label>
          </form>
        </Card>

        <Card>
          <h2 className="mb-5 flex items-center gap-2 font-bold text-navy-950">
            <KeyRound className="h-5 w-5 text-teal-600" />
            Segurança de acesso
          </h2>
          <form className="space-y-3" onSubmit={handleChangePassword}>
            <label className="block">
              <span className="text-sm font-bold text-navy-900">
                Senha atual
              </span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                onChange={(event) => setOldPassword(event.target.value)}
                type="password"
                value={oldPassword}
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy-900">
                Nova senha
              </span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                value={newPassword}
              />
            </label>
            <Button disabled={saving} type="submit" variant="outline">
              Atualizar senha
            </Button>
          </form>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-navy-950">
              <CreditCard className="h-5 w-5 text-teal-600" />
              Plano e assinatura
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Plano atual: <strong>{billing?.subscription?.plan.name ?? "Carregando..."}</strong>
              {billing?.subscription ? ` · ${billing.subscription.status}` : ""}
            </p>
          </div>
          {!billing?.gatewayConfigured ? (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Asaas aguardando configuração
            </span>
          ) : null}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {billing?.plans.map((plan) => (
            <div className={`rounded-2xl border p-5 ${billing.subscription?.plan.id === plan.id ? "border-blue-300 bg-blue-50/50" : "border-slate-200"}`} key={plan.id}>
              <h3 className="font-bold text-navy-950">{plan.name}</h3>
              <p className="mt-2 text-2xl font-black text-navy-950">
                {(plan.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                <span className="text-xs font-medium text-slate-500">/{plan.billingInterval === "YEARLY" ? "ano" : "mês"}</span>
              </p>
              <p className="mt-2 min-h-10 text-sm text-slate-500">{plan.description}</p>
              <Button className="mt-4 w-full" disabled={!billing.gatewayConfigured || checkoutLoading !== null} onClick={() => void handleCheckout(plan.id)} variant={billing.subscription?.plan.id === plan.id ? "outline" : "primary"}>
                {checkoutLoading === plan.id ? "Abrindo..." : billing.subscription?.plan.id === plan.id ? "Renovar plano" : "Escolher plano"}
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          [UserCog, "Permissões", "Controle cargos e acessos da equipe."],
          [KeyRound, "Segurança", "Política de senha e sessões."],
          [
            ShieldCheck,
            "Multi-tenant",
            "Igreja isolada por tenant no backend.",
          ],
        ].map(([Icon, title, description]) => (
          <Card key={String(title)}>
            <Icon className="h-8 w-8 text-blue-700" />
            <h2 className="mt-4 font-bold text-navy-950">{String(title)}</h2>
            <p className="mt-2 text-sm text-slate-500">{String(description)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
