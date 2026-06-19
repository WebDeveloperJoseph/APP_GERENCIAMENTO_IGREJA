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
  [
    "Eventos",
    "Divulgue eventos e confirme presenca com facilidade.",
    CalendarDays,
  ],
  [
    "Financas",
    "Controle entradas, ofertas e despesas com transparencia.",
    DollarSign,
  ],
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
            <span className="inline-flex px-4 py-2 text-sm font-semibold border rounded-full border-amber-200 bg-amber-50 text-amber-700">
              Plataforma para igrejas que querem organizar melhor o cuidado
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight text-navy-950 md:text-6xl">
              A plataforma completa para conectar, organizar e fortalecer sua
              igreja
            </h1>
            <p className="max-w-2xl mt-5 text-lg leading-8 text-slate-600">
              Gestao de membros, eventos, financas, comunicacao e relatorios em
              um so lugar. Menos planilha, mais cuidado pastoral.
            </p>
            <div className="flex flex-col gap-3 mt-8 sm:flex-row">
              <Link to="/cadastro-igreja">
                <Button>
                  Criar conta da igreja <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/app">
                <Button variant="outline">Ver demonstracao</Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-5 mt-6 text-sm font-semibold text-slate-600">
              {[
                "Facil de usar",
                "Seguro e confiavel",
                "Suporte humanizado",
              ].map((item) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ProductMockup />
        </div>
      </section>

      <section className="px-5 py-12 mx-auto max-w-7xl" id="recursos">
        <div className="flex flex-col justify-between gap-3 mb-8 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black text-navy-950">
              Tudo que a igreja precisa
            </h2>
            <p className="mt-2 text-slate-500">
              Modulos pensados para lideres, secretarias, tesoureiros e membros.
            </p>
          </div>
          <span className="px-4 py-2 text-sm font-bold text-teal-700 rounded-full bg-teal-50">
            Web + Mobile + SaaS
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {resources.map(([title, description, Icon]) => (
            <Card key={title}>
              <Icon className="text-teal-600 h-9 w-9" />
              <h3 className="mt-4 font-bold text-navy-950">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-5 bg-slate-50 py-14">
        <div className="grid gap-5 mx-auto max-w-7xl md:grid-cols-3">
          {[
            [
              "Para pastores",
              "Visao clara de membros, eventos, agenda e acompanhamento.",
            ],
            [
              "Para tesoureiros",
              "Entradas, saidas, ofertas e relatorios com transparencia.",
            ],
            [
              "Para membros",
              "Eventos, avisos, aniversarios e vida comunitaria em um lugar.",
            ],
          ].map(([title, description]) => (
            <Card key={title}>
              <ShieldCheck className="text-blue-700 h-9 w-9" />
              <h3 className="mt-4 text-xl font-black text-navy-950">{title}</h3>
              <p className="mt-2 text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        className="grid gap-10 px-5 py-12 mx-auto max-w-7xl lg:grid-cols-2"
        id="planos"
      >
        <div>
          <h2 className="text-3xl font-black text-navy-950">
            Planos que cabem na sua igreja
          </h2>
          <div className="grid gap-4 mt-6 md:grid-cols-3">
            {plans.map(([name, price, description]) => (
              <Card
                className={name === "Padrao" ? "border-2 border-teal-500" : ""}
                key={name}
              >
                <h3 className="font-bold">{name}</h3>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
                <p className="mt-4 text-3xl font-black text-navy-950">
                  R$ {price}
                  <span className="text-sm font-medium">/mes</span>
                </p>
                <Button
                  className="w-full py-2 mt-5"
                  variant={name === "Padrao" ? "secondary" : "outline"}
                >
                  Escolher plano
                </Button>
              </Card>
            ))}
          </div>
        </div>
        <div id="como-funciona">
          <h2 className="text-3xl font-black text-navy-950">
            Comece em poucos passos
          </h2>
          <div className="grid gap-4 mt-6 sm:grid-cols-2">
            {[
              "Crie sua conta",
              "Convide sua equipe",
              "Configure recursos",
              "Comece a usar",
            ].map((step, index) => (
              <Card key={step}>
                <span className="flex items-center justify-center font-bold text-teal-700 rounded-full h-9 w-9 bg-teal-50">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-bold">{step}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Fluxo simples, guiado e preparado para lideres e equipes.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 mx-auto max-w-7xl">
        <h2 className="text-3xl font-black text-navy-950">
          O que lideres estao dizendo
        </h2>
        <div className="grid gap-4 mt-6 md:grid-cols-3">
          {testimonials.map(([name, text]) => (
            <Card key={name}>
              <p className="text-slate-600">"{text}"</p>
              <p className="mt-5 font-bold text-navy-950">{name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-5 py-12 mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-gradient-to-r from-navy-950 to-teal-700 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-black">
                Pronto para organizar sua igreja?
              </h2>
              <p className="max-w-2xl mt-3 text-blue-100">
                Comece em modo demonstracao e conecte ao backend real conforme
                os modulos forem liberados.
              </p>
            </div>
            <Link to="/cadastro-igreja">
              <Button className="bg-white text-navy-950 hover:bg-blue-50">
                Comecar agora <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-5 py-10 text-white bg-navy-950" id="contato">
        <div className="flex flex-col justify-between gap-6 mx-auto max-w-7xl md:flex-row">
          <div>
            <strong className="text-xl">Igreja Connect</strong>
            <p className="max-w-sm mt-2 text-blue-100">
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
