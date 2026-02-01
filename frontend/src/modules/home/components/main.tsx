"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { HeroSection } from "./hero-section";
import { BookFilter } from "./book-filter";
import { BookGrid } from "./book-grid";
import { Footer } from "./footer";
import { useBooks } from "../hooks/use-books";
import { useCategories } from "../hooks/use-categories";
import type { BookQueryParams, BooksResponse } from "../schemas/book.schema";
import type { Book } from "../schemas/book.schema";

interface HomeMainProps {
  initialBooks?: BooksResponse | null;
}

export function HomeMain({ initialBooks }: HomeMainProps) {
  const [filters, setFilters] = useState<BookQueryParams>({});

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
