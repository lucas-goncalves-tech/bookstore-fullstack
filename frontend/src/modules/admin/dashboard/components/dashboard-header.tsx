"use client";

import { useUser } from "@/hooks/use-user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <Button
        asChild
        className="bg-primary hover:bg-primary/90 text-white gap-2 h-10 px-5 shadow-sm"
      >
        <Link href="/admin/books/new">
          <Plus className="size-5" />
          <span>Adicionar Livro</span>
        </Link>
      </Button>
    </div>
  );
}
