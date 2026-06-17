import { Church } from "lucide-react";
import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="flex items-center gap-3" to="/">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-900 text-white">
        <Church className="h-6 w-6" />
      </div>
      {!compact ? (
        <strong className="text-xl font-extrabold text-navy-950">
          Igreja <span className="text-teal-600">Connect</span>
        </strong>
      ) : null}
    </Link>
  );
}
