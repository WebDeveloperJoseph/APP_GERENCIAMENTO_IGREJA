export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "teal" | "red" | "amber" | "slate";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
