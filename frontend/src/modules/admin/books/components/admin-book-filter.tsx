"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import type { Category } from "@/modules/home/schemas/category.schema";
import { PriceSortOrder } from "@/modules/home/components/book-filter";

const DEBOUNCE_DELAY = 400;
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 500;

interface AdminBookFilterProps {
  categories: Category[];
  actionButton?: React.ReactNode;
}

export function AdminBookFilter({ categories, actionButton }: AdminBookFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categorySlug = searchParams.get("categorySlug") ?? "";
  const sortOrder = (searchParams.get("sort") as PriceSortOrder) ?? "none";
  const minPrice = Number(searchParams.get("minPrice")) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(searchParams.get("maxPrice")) || DEFAULT_MAX_PRICE;

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    setLocalPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

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

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        updateParams({ search: localSearch || undefined });
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [localSearch, search, updateParams]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3">
      {/* Left controls: search + category + sort */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar livro, autor..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="h-9 w-full pl-8 bg-background"
          />
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Select
            value={categorySlug || "all"}
            onValueChange={(value) => updateParams({ categorySlug: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[150px] bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Categoria" />
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
          <Select
            value={sortOrder}
            onValueChange={(value) => updateParams({ sort: value })}
          >
            <SelectTrigger className="h-9 w-full sm:w-[140px] bg-background text-xs sm:text-sm">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem ordenar</SelectItem>
              <SelectItem value="asc">Menor Preço</SelectItem>
              <SelectItem value="desc">Maior Preço</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Right controls: slider + action */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-between sm:justify-end border-t border-border lg:border-none pt-4 lg:pt-0">
        <div className="flex items-center gap-3 px-2">
          <span className="text-xs font-medium text-muted-foreground min-w-14 text-right">
            {formatPrice(localPriceRange[0])}
          </span>
          <Slider
            value={localPriceRange}
            onValueChange={(value) => setLocalPriceRange([value[0], value[1]])}
            min={0}
            max={500}
            step={10}
            className="w-32 active:cursor-grabbing"
          />
          <span className="text-xs font-medium text-muted-foreground min-w-14">
            {formatPrice(localPriceRange[1])}
          </span>
        </div>

        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          {actionButton}
        </div>
      </div>
    </div>
  );
}
