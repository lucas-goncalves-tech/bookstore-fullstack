"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { HeroSection } from "./hero-section";
import { BookFilter } from "./book-filter";
import { BookGrid } from "./book-grid";
import { Footer } from "./footer";
import { useBooks } from "../hooks/use-books";
import { useCategories } from "../hooks/use-categories";
import type { BookQueryParams } from "../schemas/book.schema";
import type { Book } from "../schemas/book.schema";

// Debounce para evitar muitas requisições
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function HomeMain() {
  const [filters, setFilters] = useState<BookQueryParams>({});
  const debouncedFilters = useDebounce(filters, 300);

  const { data: booksResponse, isLoading: isLoadingBooks } =
    useBooks(debouncedFilters);
  const { data: categories = [] } = useCategories();

  const books = useMemo(() => {
    if (!booksResponse) return [];
    // Handle both array and paginated response formats
    return Array.isArray(booksResponse)
      ? booksResponse
      : booksResponse.data ?? [];
  }, [booksResponse]);

  const handleFilterChange = useCallback((newFilters: BookQueryParams) => {
    setFilters(newFilters);
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
        initialValues={filters}
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
