import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Brand } from "./Brand";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-navy-900 md:flex">
          <a href="/#recursos">Recursos</a>
          <a href="/#planos">Planos</a>
          <a href="/#como-funciona">Como funciona</a>
          <a href="/#contato">Contato</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link className="hidden text-sm font-semibold text-navy-900 sm:block" to="/login">
            Entrar
          </Link>
          <Link to="/cadastro-igreja">
            <Button className="py-2.5">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
