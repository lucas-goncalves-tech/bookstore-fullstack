"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { Category } from "../schemas/category.schema";
import type { BookQueryParams } from "../schemas/book.schema";

export type PriceSortOrder = "none" | "asc" | "desc";

interface BookFilterProps {
  categories: Category[];
  onFilterChange: (filters: BookQueryParams) => void;
  onSortChange: (order: PriceSortOrder) => void;
  initialValues?: Partial<BookQueryParams>;
  sortOrder?: PriceSortOrder;
}

const DEBOUNCE_DELAY = 400;

export function BookFilter({
  categories,
  onFilterChange,
  onSortChange,
  initialValues,
  sortOrder = "none",
}: BookFilterProps) {
  const [search, setSearch] = useState(initialValues?.search ?? "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialValues?.minPrice ?? 0,
    initialValues?.maxPrice ?? 500,
  ]);

  const isFirstRender = useRef(true);

  // Debounce: só chama onFilterChange após parar de interagir
  useEffect(() => {
    // Skip first render to avoid calling onFilterChange with initial values
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      onFilterChange({
        search: search || undefined,
        categoryId: categoryId || undefined,
        minPrice: priceRange[0] || undefined,
        maxPrice: priceRange[1] || undefined,
      });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [search, categoryId, priceRange, onFilterChange]);

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-12 w-full cursor-pointer appearance-none rounded-lg border border-input bg-background px-4 pr-10 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
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
                onChange={(e) => onSortChange(e.target.value as PriceSortOrder)}
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
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </span>
            </div>
            <div className="flex h-12 items-center">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
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
