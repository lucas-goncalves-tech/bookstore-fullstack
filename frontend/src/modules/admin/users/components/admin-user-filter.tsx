"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEBOUNCE_DELAY = 400;

interface AdminUserFilterProps {
  actionButton?: React.ReactNode;
}

export function AdminUserFilter({ actionButton }: AdminUserFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const order = searchParams.get("order") ?? "none";

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      if (resetPage) {
        params.delete("page");
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "none") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams({ search: term || undefined });
  }, DEBOUNCE_DELAY);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3">
      {/* Left controls: search + sort */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-9 w-full pl-8 bg-background"
          />
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Select
            value={order}
            onValueChange={(value) => updateParams({ order: value })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[200px] bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Padrão</SelectItem>
              <SelectItem value="asc">Mais antigos primeiro</SelectItem>
              <SelectItem value="desc">Mais recentes primeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Right controls: action */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-between sm:justify-end border-t border-border lg:border-none pt-4 lg:pt-0">
        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          {actionButton}
        </div>
      </div>
    </div>
  );
}
