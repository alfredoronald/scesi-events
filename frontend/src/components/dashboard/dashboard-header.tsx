"use client";
import { Search } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { user } = useAuth();
  const firstName = user?.nombreCompleto.split(" ")[0] ?? "";

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-scesi-grey-normal/60 uppercase">
          Tu agenda SCESI
        </p>
        <h1 className="mt-3 text-title text-scesi-grey-normal md:text-display">
          Hola, {firstName}
        </h1>
      </div>

      <Button href="/dashboard/explorar" className="self-start sm:self-auto">
        <Search className="h-4 w-4" aria-hidden="true" />
        Explorar eventos
      </Button>
    </header>
  );
}
