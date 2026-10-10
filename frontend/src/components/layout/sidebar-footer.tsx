"use client";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function SidebarFooter({
  footer,
  children,
  className,
}: {
  footer: { label: string; href: string };
  children?: ReactNode;
  className?: string;
}) {
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <div className={cn("border-t border-scesi-grey-dark px-3 py-4", className)}>
      {children}
      <button
        type="button"
        disabled={pending}
        onClick={async () => { setPending(true); setError(""); try { await logout(); } catch { setError("No se pudo cerrar la sesión."); } finally { setPending(false); } }}
        className={cn(
          "group flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm font-medium outline-none",
          "text-scesi-grey-light-active transition-colors hover:text-white",
          "focus-visible:ring-2 focus-visible:ring-scesi-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-scesi-grey-normal",
        )}
      >
        {pending ? "Cerrando…" : footer.label}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>
      {error && <p role="alert" className="px-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}
