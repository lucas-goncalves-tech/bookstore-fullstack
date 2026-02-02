import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Book } from "../schemas/book.schema";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
      <Link href={`/books/${book.id}`} className="flex flex-1 flex-col">
        {/* Cover Image */}
        <div className="relative mb-4 aspect-4/3 w-full overflow-hidden rounded-md shadow-md">
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110",
              !book.coverThumbUrl && "bg-muted flex items-center justify-center"
            )}
            style={
              book.coverThumbUrl
                ? { backgroundImage: `url("${book.coverThumbUrl}")` }
                : undefined
            }
            aria-label={`Capa do livro: ${book.title}`}
          >
            {book.coverThumbUrl ? <Image
              src={book.coverThumbUrl}
              alt={book.title}
              fill
            /> : (
              <span className="text-4xl text-muted-foreground">📚</span>
            )}
          </div>
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
        </div>
      </Link>

      {/* Footer (Not wrapped in Link to allow button interaction) */}
      <div className="mt-auto flex flex-col gap-4 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-foreground">
            {formattedPrice}
          </span>

          {book.category && (
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {book.category.name}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.(book);
          }}
          className="rounded-lg flex w-full items-center justify-center gap-2"
          aria-label={`Adicionar ${book.title} ao carrinho`}
        >
          <ShoppingCart className="size-5" />
          Carrinho
        </Button>
      </div>
    </div>
  );
}
