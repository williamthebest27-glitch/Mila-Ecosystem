import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "./Link";

type Props = {
  to: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light" | "ghost-light";
  arrow?: "right" | "up" | "none";
  className?: string;
  size?: "md" | "lg";
};

export function Button({ to, children, variant = "primary", arrow = "right", className = "", size = "md" }: Props) {
  const sizeCls = size === "lg" ? "!px-7 !py-[1.15rem] !text-base" : "";
  return (
    <Link to={to} className={`btn btn-${variant} ${sizeCls} ${className}`}>
      <span>{children}</span>
      {arrow === "right" && <ArrowRight className="btn-arrow h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
      {arrow === "up" && <ArrowUpRight className="btn-arrow h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
    </Link>
  );
}
