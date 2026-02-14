"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Debounced URL update for slider
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localPriceRange[0] !== minPrice || localPriceRange[1] !== maxPrice) {
        updateParams({
          minPrice: String(localPriceRange[0]),
          maxPrice: String(localPriceRange[1]),
        }, true);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [localPriceRange, minPrice, maxPrice, updateParams]);

  // Debounced search handler
  const handleSearchChange = useCallback(
    (value: string) => {
      updateParams({ search: value || undefined });
    },
    [updateParams],
  );

  // Debounce for search input
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        handleSearchChange(localSearch);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [localSearch, search, handleSearchChange]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <section className="mb-8 w-full px-6">
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
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="h-12 pr-12"
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
            <div className="relative">
              <select
                value={categorySlug}
                onChange={(e) =>
                  updateParams({ categorySlug: e.target.value || undefined })
                }
                className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-4 pr-10 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <ChevronDown className="size-5" />
              </div>
            </div>
          </div>

          {/* Price Sort */}
          <div className="w-full lg:w-auto">
            <label className="mb-2 block text-sm font-bold text-muted-foreground">
              Ordenar
            </label>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) =>
                  updateParams({ sort: e.target.value || undefined })
                }
                className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-4 pr-10 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring lg:w-44"
              >
                <option value="none">Sem ordenar</option>
                <option value="asc">Menor preço</option>
                <option value="desc">Maior preço</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <ArrowUpDown className="size-5" />
              </div>
            </div>
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
                onValueChange={(value) =>
                  setLocalPriceRange([value[0], value[1]])
                }
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
