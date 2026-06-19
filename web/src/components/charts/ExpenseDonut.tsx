import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#0d47a1", "#1d4ed8", "#0ea5a6", "#64748b", "#94a3b8"];

export function ExpenseDonut({
  data = [],
}: {
  data?: { name: string; value: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-500">
        Sem despesas para exibir.
      </div>
    );
  }

  return (
    <ResponsiveContainer height={260} width="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={62}
          outerRadius={96}
          paddingAngle={4}
        >
          {data.map((item, index) => (
            <Cell fill={colors[index % colors.length]} key={item.name} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
