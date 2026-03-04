"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "../schemas/category.schema";

export type PriceSortOrder = "none" | "asc" | "desc";

interface BookFilterProps {
  categories: Category[];
}

const DEBOUNCE_DELAY = 400;
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 500;

export function BookFilter({ categories }: BookFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read values from URL
  const search = searchParams.get("search") ?? "";
  const categorySlug = searchParams.get("categorySlug") ?? "";
  const sortOrder = (searchParams.get("sort") as PriceSortOrder) ?? "none";
  const minPrice = Number(searchParams.get("minPrice")) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(searchParams.get("maxPrice")) || DEFAULT_MAX_PRICE;

  // Local state for slider (for smooth UX before debounce)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  // Sync local slider state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setLocalPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset page to 1 when filters change (unless explicitly keeping page)
      if (resetPage) {
        params.delete("page");
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "none") {
          params.delete(key);
        } else if (key === "minPrice" && value === String(DEFAULT_MIN_PRICE)) {
          params.delete(key);
        } else if (key === "maxPrice" && value === String(DEFAULT_MAX_PRICE)) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handlePriceChange = useDebouncedCallback((range: [number, number]) => {
    if (range[0] !== minPrice || range[1] !== maxPrice) {
      updateParams({
        minPrice: String(range[0]),
        maxPrice: String(range[1]),
      }, true);
    }
  }, DEBOUNCE_DELAY);

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParams({ search: term || undefined });
  }, DEBOUNCE_DELAY);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <section className="mb-8 w-full px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6 shadow-sm lg:flex-row lg:items-center">
          {/* Search */}
          <div className="w-full lg:w-1/3">
            <label className="mb-2 block text-sm font-bold text-muted-foreground">
              Buscar
            </label>
            <div className="group/input relative">
              <Input
                type="text"
                placeholder="Buscar livro, autor..."
                defaultValue={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-12 pr-12 bg-background/50 hover:bg-background/80 transition-colors"
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary">
                <Search className="size-5" />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="w-full lg:w-1/4">
            <label className="mb-2 block text-sm font-bold text-muted-foreground">
              Categoria
            </label>
            <Select
              value={categorySlug || "all"}
              onValueChange={(value) =>
                updateParams({ categorySlug: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="h-12 w-full bg-background/50 hover:bg-background/80 transition-colors">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Sort */}
          <div className="w-full lg:w-auto">
            <label className="mb-2 block text-sm font-bold text-muted-foreground">
              Ordenar
            </label>
            <Select
              value={sortOrder}
              onValueChange={(value) => updateParams({ sort: value })}
            >
              <SelectTrigger className="h-12 w-full lg:w-44 bg-background/50 hover:bg-background/80 transition-colors">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem ordenar</SelectItem>
                <SelectItem value="asc">Menor preço</SelectItem>
                <SelectItem value="desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="w-full lg:w-1/3">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-bold text-muted-foreground">
                Faixa de Preço
              </label>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {formatPrice(localPriceRange[0])} -{" "}
                {formatPrice(localPriceRange[1])}
              </span>
            </div>
            <div className="flex h-12 items-center">
              <Slider
                value={localPriceRange}
                onValueChange={(value) => {
                  setLocalPriceRange([value[0], value[1]]);
                  handlePriceChange([value[0], value[1]]);
                }}
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
