import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { revenueSeries } from "@/data/mockData";

export function RevenueChart() {
  return (
    <ResponsiveContainer height={260} width="100%">
      <AreaChart data={revenueSeries}>
        <defs>
          <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#0d47a1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#0d47a1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} />
        <YAxis tickFormatter={(value) => `R$ ${Number(value) / 1000}k`} />
        <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
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
