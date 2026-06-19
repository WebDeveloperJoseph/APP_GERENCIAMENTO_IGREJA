import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenuePoint = { month: string; entradas?: number; saidas?: number };

export function RevenueChart({ data = [] }: { data?: RevenuePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-500">
        Sem dados financeiros para exibir.
      </div>
    );
  }

  return (
    <ResponsiveContainer height={260} width="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#0d47a1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#0d47a1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} />
        <YAxis tickFormatter={(value) => `R$ ${Number(value) / 1000}k`} />
        <Tooltip
          formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
        />
        <Area
          dataKey="entradas"
          fill="url(#income)"
          stroke="#0d47a1"
          strokeWidth={3}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
