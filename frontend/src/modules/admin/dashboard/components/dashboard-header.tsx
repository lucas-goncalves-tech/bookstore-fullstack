"use client";

import { useUser } from "@/hooks/use-user";

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-heading font-bold text-card-foreground">
          Bom dia, {user?.name || "Admin"}
        </h2>
        <p className="text-muted-foreground font-sans">
          Aqui está o que está acontecendo na sua livraria hoje.
        </p>
      </div>
    </div>
  );
}
