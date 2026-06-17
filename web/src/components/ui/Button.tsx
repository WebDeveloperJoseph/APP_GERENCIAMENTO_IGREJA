import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children: ReactNode;
};

const variants = {
  primary: "bg-navy-800 text-white hover:bg-navy-900 shadow-soft",
  secondary: "bg-teal-500 text-white hover:bg-teal-600 shadow-soft",
  outline: "border border-slate-200 bg-white text-navy-900 hover:bg-slate-50",
  ghost: "text-navy-800 hover:bg-navy-50",
};

export function Button({
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
