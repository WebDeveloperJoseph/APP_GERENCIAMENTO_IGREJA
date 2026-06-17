import { Inbox } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <Inbox className="h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
