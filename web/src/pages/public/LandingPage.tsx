import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Gift,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { ProductMockup } from "@/components/marketing/ProductMockup";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const resources = [
  ["Membros", "Cadastre, organize e acompanhe sua congregacao.", Users],
  ["Eventos", "Divulgue eventos e confirme presenca com facilidade.", CalendarDays],
  ["Financas", "Controle entradas, ofertas e despesas com transparencia.", DollarSign],
  ["Comunicacao", "Envie avisos e mantenha todos informados.", Megaphone],
  ["Aniversariantes", "Nunca esqueca uma data especial.", Gift],
  ["Relatorios", "Decisoes melhores com indicadores claros.", BarChart3],
] as const;

const plans = [
  ["Basico", "49", "Ideal para igrejas pequenas"],
  ["Padrao", "99", "Perfeito para igrejas em crescimento"],
  ["Premium", "199", "Membros ilimitados e recursos avancados"],
] as const;

const testimonials = [
  [
    "Pr. Marcos Silva",
    "Nossa forma de gerir a igreja mudou. Tudo ficou mais organizado e nossa comunicacao melhorou demais.",
  ],
  [
    "Pra. Juliana Costa",
    "A plataforma e completa, facil de usar e o suporte e incrivel. Recomendo para toda igreja que quer crescer.",
  ],
  [
    "Pr. Daniel Ferreira",
    "Conseguimos mais tempo para cuidar de pessoas enquanto o sistema cuida da gestao.",
  ],
] as const;

export function LandingPage() {
  return (
    <div className="bg-white">
      <PublicHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_0.95fr] lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              Plataforma para igrejas que querem organizar melhor o cuidado
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight text-navy-950 md:text-6xl">
              A plataforma completa para conectar, organizar e fortalecer sua igreja
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Gestao de membros, eventos, financas, comunicacao e relatorios em
              um so lugar. Menos planilha, mais cuidado pastoral.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/cadastro-igreja">
                <Button>
                  Criar conta da igreja <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/app">
                <Button variant="outline">Ver demonstracao</Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold text-slate-600">
              {["Facil de usar", "Seguro e confiavel", "Suporte humanizado"].map(
                (item) => (
                  <span className="inline-flex items-center gap-2" key={item}>
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <ProductMockup />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12" id="recursos">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black text-navy-950">Tudo que a igreja precisa</h2>
            <p className="mt-2 text-slate-500">
              Modulos pensados para lideres, secretarias, tesoureiros e membros.
            </p>
          </div>
          <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">
            Web + Mobile + SaaS
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {resources.map(([title, description, Icon]) => (
            <Card key={title}>
              <Icon className="h-9 w-9 text-teal-600" />
              <h3 className="mt-4 font-bold text-navy-950">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["Para pastores", "Visao clara de membros, eventos, agenda e acompanhamento."],
            ["Para tesoureiros", "Entradas, saidas, ofertas e relatorios com transparencia."],
            ["Para membros", "Eventos, avisos, aniversarios e vida comunitaria em um lugar."],
          ].map(([title, description]) => (
            <Card key={title}>
              <ShieldCheck className="h-9 w-9 text-blue-700" />
              <h3 className="mt-4 text-xl font-black text-navy-950">{title}</h3>
              <p className="mt-2 text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-2" id="planos">
        <div>
          <h2 className="text-3xl font-black text-navy-950">Planos que cabem na sua igreja</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map(([name, price, description]) => (
              <Card className={name === "Padrao" ? "border-2 border-teal-500" : ""} key={name}>
                <h3 className="font-bold">{name}</h3>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
                <p className="mt-4 text-3xl font-black text-navy-950">
                  R$ {price}<span className="text-sm font-medium">/mes</span>
                </p>
                <Button className="mt-5 w-full py-2" variant={name === "Padrao" ? "secondary" : "outline"}>
                  Escolher plano
                </Button>
              </Card>
            ))}
          </div>
        </div>
        <div id="como-funciona">
          <h2 className="text-3xl font-black text-navy-950">Comece em poucos passos</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {["Crie sua conta", "Convide sua equipe", "Configure recursos", "Comece a usar"].map(
              (step, index) => (
                <Card key={step}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-bold">{step}</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Fluxo simples, guiado e preparado para lideres e equipes.
                  </p>
                </Card>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <h2 className="text-3xl font-black text-navy-950">O que lideres estao dizendo</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map(([name, text]) => (
            <Card key={name}>
              <p className="text-slate-600">"{text}"</p>
              <p className="mt-5 font-bold text-navy-950">{name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="rounded-[2rem] bg-gradient-to-r from-navy-950 to-teal-700 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black">Pronto para organizar sua igreja?</h2>
              <p className="mt-3 max-w-2xl text-blue-100">
                Comece em modo demonstracao e conecte ao backend real conforme os modulos forem liberados.
              </p>
            </div>
            <Link to="/cadastro-igreja">
              <Button className="bg-white text-navy-950 hover:bg-blue-50">
                Comecar agora <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-navy-950 px-5 py-10 text-white" id="contato">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <strong className="text-xl">Igreja Connect</strong>
            <p className="mt-2 max-w-sm text-blue-100">
              A tecnologia que conecta pessoas e fortalece a gestao da igreja.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-blue-100">
            <span>Recursos</span>
            <span>Planos</span>
            <span>Privacidade</span>
            <span>Contato</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
