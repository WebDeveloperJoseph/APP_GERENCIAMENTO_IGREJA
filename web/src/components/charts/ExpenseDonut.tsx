import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { expenseByCategory } from "@/data/mockData";

const colors = ["#0d47a1", "#1d4ed8", "#0ea5a6", "#64748b", "#94a3b8"];

export function ExpenseDonut() {
  return (
    <ResponsiveContainer height={260} width="100%">
      <PieChart>
        <Pie
          data={expenseByCategory}
          dataKey="value"
          innerRadius={62}
          outerRadius={96}
          paddingAngle={4}
        >
          {expenseByCategory.map((item, index) => (
            <Cell fill={colors[index % colors.length]} key={item.name} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
