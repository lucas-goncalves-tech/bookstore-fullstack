"use client";

import { useState, useCallback } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { Category } from "../schemas/category.schema";
import type { BookQueryParams } from "../schemas/book.schema";

interface BookFilterProps {
  categories: Category[];
  onFilterChange: (filters: BookQueryParams) => void;
  initialValues?: Partial<BookQueryParams>;
}

export function BookFilter({
  categories,
  onFilterChange,
  initialValues,
}: BookFilterProps) {
  const [search, setSearch] = useState(initialValues?.search ?? "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialValues?.minPrice ?? 0,
    initialValues?.maxPrice ?? 500,
  ]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      onFilterChange({
        search: value || undefined,
        categoryId: categoryId || undefined,
        minPrice: priceRange[0] || undefined,
        maxPrice: priceRange[1] || undefined,
      });
    },
    [categoryId, priceRange, onFilterChange]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategoryId(value);
      onFilterChange({
        search: search || undefined,
        categoryId: value || undefined,
        minPrice: priceRange[0] || undefined,
        maxPrice: priceRange[1] || undefined,
      });
    },
    [search, priceRange, onFilterChange]
  );

  const handlePriceChange = useCallback(
    (value: number[]) => {
      const range: [number, number] = [value[0], value[1]];
      setPriceRange(range);
      onFilterChange({
        search: search || undefined,
        categoryId: categoryId || undefined,
        minPrice: range[0] || undefined,
        maxPrice: range[1] || undefined,
      });
    },
    [search, categoryId, onFilterChange]
  );

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
                onChange={(e) => handleSearchChange(e.target.value)}
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
                onChange={(e) => handleCategoryChange(e.target.value)}
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
                onValueChange={handlePriceChange}
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
