"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { HeroSection } from "./hero-section";
import { BookFilter, type PriceSortOrder } from "./book-filter";
import { BookGrid } from "./book-grid";
import { useBooks } from "../hooks/use-books";
import { useCategories } from "../hooks/use-categories";
import type { BookQueryParams, BooksResponse } from "../schemas/book.schema";
import type { Book } from "../schemas/book.schema";
import { Footer } from "@/components/footer";

interface HomeMainProps {
  initialBooks?: BooksResponse | null;
}

export function HomeMain({ initialBooks }: HomeMainProps) {
  const [filters, setFilters] = useState<BookQueryParams>({});
  const [priceSortOrder, setPriceSortOrder] = useState<PriceSortOrder>("none");

  // Passa initialData apenas quando não há filtros aplicados
  const hasFilters = Object.keys(filters).length > 0;
  const { data: booksResponse, isLoading: isLoadingBooks } = useBooks({
    params: filters,
    initialData: hasFilters ? undefined : initialBooks,
  });
  const { data: categories = [] } = useCategories();

  const books = useMemo(() => {
    if (!booksResponse) return [];
    // Handle both array and paginated response formats
    const rawBooks = Array.isArray(booksResponse)
      ? booksResponse
      : booksResponse.data ?? [];

    // Ordenação client-side por preço
    if (priceSortOrder === "none") return rawBooks;

    return [...rawBooks].sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      return priceSortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  }, [booksResponse, priceSortOrder]);

  const handleFilterChange = useCallback((newFilters: BookQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((order: PriceSortOrder) => {
    setPriceSortOrder(order);
  }, []);

  const handleAddToCart = useCallback((book: Book) => {
    toast.success(`"${book.title}" adicionado ao carrinho!`);
  }, []);

  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <HeroSection />
      <BookFilter
        categories={categories}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        initialValues={filters}
        sortOrder={priceSortOrder}
      />
      <BookGrid
        books={books}
        isLoading={isLoadingBooks}
        onAddToCart={handleAddToCart}
      />
      <Footer />
    </main>
  );
}
