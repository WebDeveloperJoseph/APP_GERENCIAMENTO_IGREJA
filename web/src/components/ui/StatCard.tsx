import type { LucideIcon } from "lucide-react";

import { Card } from "./Card";

export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "blue",
}: {
  title: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
  tone?: "blue" | "teal" | "red" | "amber";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <strong className="mt-2 block text-2xl font-bold text-navy-950">
            {value}
          </strong>
          {helper ? (
            <span className="mt-2 block text-xs font-medium text-teal-600">
              {helper}
            </span>
          ) : null}
        </div>
        <div className={`rounded-2xl p-3 ${colors[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
