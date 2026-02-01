"use client";

import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Book } from "../schemas/book.schema";

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
}

export function BookCard({ book, onAddToCart }: BookCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(book.price);

  return (
    <div className="group flex flex-col rounded-lg border border-transparent bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl">
      {/* Cover Image */}
      <div className="relative mb-4 aspect-2/3 w-full overflow-hidden rounded-md shadow-md">
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110",
            !book.coverUrl && "bg-muted flex items-center justify-center"
          )}
          style={
            book.coverUrl
              ? { backgroundImage: `url("${book.coverUrl}")` }
              : undefined
          }
          aria-label={`Capa do livro: ${book.title}`}
        >
          {!book.coverUrl && (
            <span className="text-4xl text-muted-foreground">📚</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(book)}
          className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition-colors hover:bg-primary hover:text-white"
          aria-label={`Adicionar ${book.title} ao carrinho`}
        >
          <ShoppingCart className="size-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h4 className="mb-1 text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          {book.title}
        </h4>

        <p className="mb-3 text-sm italic text-muted-foreground">
          {book.author}
        </p>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-secondary-foreground">
          {book.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="text-xl font-black text-foreground">
            {formattedPrice}
          </span>

          {book.category && (
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {book.category.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
