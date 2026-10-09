import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "outline-light";
export type ButtonSize = "sm" | "md";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-scesi-red-normal text-white hover:bg-scesi-red-normal-hover active:bg-scesi-red-normal-active",
  outline:
    "border border-scesi-grey-light-active text-scesi-grey-normal hover:bg-scesi-grey-light hover:text-scesi-grey-normal",
  "outline-light":
    "border border-white/30 text-white hover:border-white/50 hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
};

type ButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

/**
 * Botón de navegación (Next Link) con las variantes del diseño SCESI.
 * Es un Server Component: sin handlers, cero JS de cliente.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-scesi-red-normal focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
