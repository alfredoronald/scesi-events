import type { ReactNode } from "react";
import Link from "next/link";
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
  return (
    <div className={cn("border-t border-scesi-grey-dark px-3 py-4", className)}>
      {children}
      <Link
        href={footer.href}
        className={cn(
          "group flex h-10 items-center justify-between rounded-lg px-3 text-sm font-medium outline-none",
          "text-scesi-grey-light-active transition-colors hover:text-white",
          "focus-visible:ring-2 focus-visible:ring-scesi-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-scesi-grey-normal",
        )}
      >
        {footer.label}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
