"use client";

import { Sparkles } from "lucide-react";
import { BookCard } from "./book-card";
import type { Book } from "../schemas/book.schema";

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  onAddToCart?: (book: Book) => void;
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col rounded-lg bg-card p-4"
        >
          <div className="mb-4 aspect-2/3 w-full rounded-lg bg-muted" />
          <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
          <div className="mb-3 h-4 w-1/2 rounded bg-muted" />
          <div className="mb-4 space-y-2">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-5/6 rounded bg-muted" />
          </div>
          <div className="mt-auto border-t border-border pt-4">
            <div className="h-6 w-1/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookGrid({ books, isLoading, onAddToCart }: BookGridProps) {
  return (
    <section className="w-full px-6 pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Sparkles className="size-6 text-primary" />
            Destaques Mágicos
          </h3>
        </div>

        {/* Grid */}
        {isLoading ? (
          <BookGridSkeleton />
        ) : books.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-card/50">
            <p className="text-muted-foreground">
              Nenhum livro encontrado. Tente ajustar os filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
