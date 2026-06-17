import {
  BarChart3,
  CalendarDays,
  DollarSign,
  Menu,
  Users,
} from "lucide-react";

const stats = [
  ["Membros", "1.248", Users],
  ["Eventos", "18", CalendarDays],
  ["Arrecadado", "R$ 48.750", DollarSign],
  ["Relatorios", "24", BarChart3],
] as const;

export function ProductMockup() {
  return (
    <div className="relative min-h-[520px] overflow-visible lg:min-h-[560px]">
      <div className="absolute -right-8 top-4 h-72 w-72 rounded-full bg-teal-300/35 blur-3xl" />
      <div className="absolute -left-8 bottom-10 h-56 w-56 rounded-full bg-blue-400/25 blur-3xl" />

      <div className="relative ml-auto w-full max-w-[720px] rounded-[2rem] border border-slate-200 bg-slate-900 p-3 shadow-[0_28px_90px_rgba(4,27,63,0.25)]">
        <div className="rounded-[1.5rem] bg-white p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-teal-400" />
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              igreja-connect.app/admin
            </span>
          </div>

          <div className="grid min-h-[390px] grid-cols-[150px_1fr] overflow-hidden rounded-b-[1.25rem]">
            <aside className="bg-navy-950 p-4 text-white">
              <div className="mb-8 flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/15" />
                <strong className="text-sm">Igreja Connect</strong>
              </div>
              {["Inicio", "Membros", "Eventos", "Financas", "Relatorios"].map(
                (item, index) => (
                  <div
                    className={`mb-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                      index === 0 ? "bg-blue-600" : "text-blue-100"
                    }`}
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </aside>

            <main className="bg-slate-50 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-teal-600">Painel da igreja</p>
                  <h3 className="mt-1 text-xl font-black text-navy-950">
                    Bem-vindo, Pr. Lucas
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-200 to-teal-200" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {stats.map(([label, value, Icon]) => (
                  <div className="rounded-2xl bg-white p-3 shadow-sm" key={label}>
                    <Icon className="h-4 w-4 text-blue-700" />
                    <p className="mt-2 text-[10px] font-semibold text-slate-500">
                      {label}
                    </p>
                    <strong className="text-sm text-navy-950">{value}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-[1.2fr_0.8fr] gap-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <strong className="text-sm text-navy-950">Arrecadacoes</strong>
                    <span className="text-[10px] font-bold text-teal-600">+12,5%</span>
                  </div>
                  <div className="flex h-32 items-end gap-2">
                    {[35, 48, 58, 44, 65, 78, 88].map((height, index) => (
                      <div
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-700 to-teal-400"
                        key={index}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <strong className="text-sm text-navy-950">Proximos eventos</strong>
                  <div className="mt-3 space-y-3">
                    {["Culto", "Oracao", "Jovens"].map((item, index) => (
                      <div className="rounded-xl bg-blue-50 p-2 text-xs" key={item}>
                        <strong className="text-navy-950">{item}</strong>
                        <p className="text-slate-500">{21 + index}/06 - 19h</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 left-0 w-44 rounded-[2rem] border-[10px] border-slate-900 bg-white shadow-[0_24px_70px_rgba(4,27,63,0.28)] sm:w-52 lg:left-4">
        <div className="rounded-[1.35rem] bg-gradient-to-b from-navy-950 to-navy-800 p-4 text-white">
          <div className="mb-4 flex items-center justify-between">
            <Menu className="h-4 w-4" />
            <span className="text-[10px] font-bold">9:41</span>
          </div>
          <p className="text-xs text-blue-100">Ola, Ana</p>
          <h3 className="text-base font-black">Proximo culto</h3>
          <div className="mt-4 rounded-2xl bg-white/10 p-3">
            <p className="text-xs font-bold text-teal-200">Domingo</p>
            <p className="mt-1 text-sm font-bold">Culto da Familia</p>
            <p className="text-xs text-blue-100">19:00 - Templo</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {["Membros", "Eventos", "Ofertas", "Agenda"].map((item) => (
              <div className="rounded-xl bg-white p-2 text-[10px] font-bold text-navy-950" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
