"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HeroSection } from "./hero-section";
import { BookFilter, type PriceSortOrder } from "./book-filter";
import { BookGrid } from "./book-grid";
import { useBooks } from "../hooks/use-books";
import { useCategories } from "../hooks/use-categories";
import type { BooksResponse, Book } from "../schemas/book.schema";
import { Footer } from "@/components/footer";
import { SimplePagination } from "@/components/simple-pagination";
import { useCartStore } from "@/modules/cart/store/cart.store";

interface HomeMainProps {
  initialBooks?: BooksResponse | null;
}

export function HomeMain({ initialBooks }: HomeMainProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read all filter values from URL
  const search = searchParams.get("search") || undefined;
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const sortOrder = (searchParams.get("sort") as PriceSortOrder) || "none";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const page = Number(searchParams.get("page")) || 1;

  // Build params object from URL
  const params = useMemo(
    () => ({
      search,
      categorySlug,
      minPrice,
      maxPrice,
      page,
      limit: 12,
    }),
    [search, categorySlug, minPrice, maxPrice, page],
  );

  // Check if we have any filters applied
  const hasFilters = !!(search || categorySlug || minPrice || maxPrice);
  const shouldUseInitialData = !hasFilters && page === 1;

  const { data: booksResponse, isLoading: isLoadingBooks } = useBooks({
    params,
    initialData: shouldUseInitialData ? initialBooks : undefined,
  });
  const { data: categories = [] } = useCategories();

  const totalPages = useMemo(() => {
    if (!booksResponse) return 1;
    return Array.isArray(booksResponse)
      ? 1
      : (booksResponse.metadata?.totalPages ?? 1);
  }, [booksResponse]);

  const books = useMemo(() => {
    if (!booksResponse) return [];
    const rawBooks = Array.isArray(booksResponse)
      ? booksResponse
      : (booksResponse.data ?? []);

    // Client-side sorting by price
    if (sortOrder === "none") return rawBooks;

    return [...rawBooks].sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  }, [booksResponse, sortOrder]);

  // Handle page change via URL
  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete("page");
      } else {
        params.set("page", String(newPage));
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback(
    (book: Book) => {
      addItem(book);
    },
    [addItem],
  );

  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <HeroSection />
      <BookFilter categories={categories} />
      <BookGrid
        books={books}
        isLoading={isLoadingBooks}
        onAddToCart={handleAddToCart}
      />

      {!isLoadingBooks && books.length > 0 && (
        <div className="container mx-auto p-4 max-w-7xl flex items-center justify-center">
          <SimplePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Footer />
    </main>
  );
}
