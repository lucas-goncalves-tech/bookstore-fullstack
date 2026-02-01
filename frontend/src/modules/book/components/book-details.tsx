"use client";

import { Star, StarHalf, Share2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookDetailsProps {
  title: string;
  author: string;
  description: string;
  categoryName?: string | null;
  rating?: number;
  reviewCount?: number;
}

function RatingStars({ rating = 0 }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex text-primary">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="size-5 fill-current" />
      ))}
      {hasHalfStar && <StarHalf className="size-5 fill-current" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="size-5 text-muted" />
      ))}
    </div>
  );
}

export function BookDetails({
  title,
  author,
  description,
  categoryName,
  rating = 0,
  reviewCount = 0,
}: BookDetailsProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Category Badge */}
      {categoryName && (
        <div className="mb-4">
          <Badge
            variant="secondary"
            className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            {categoryName}
          </Badge>
        </div>
      )}

      {/* Título e Autor */}
      <h1 className="mb-2 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h1>
      <div className="mb-4 text-lg text-muted-foreground">
        por{" "}
        <span className="underline decoration-1 underline-offset-4 transition-colors hover:text-primary">
          {author}
        </span>
      </div>

      {/* Rating */}
      {reviewCount > 0 && (
        <div className="mb-6 flex items-center gap-2">
          <RatingStars rating={rating} />
          <span className="text-base font-bold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            ({reviewCount} avaliações)
          </span>
        </div>
      )}

      {/* Descrição curta */}
      <div className="prose prose-stone mb-6 text-muted-foreground dark:prose-invert">
        <p>{description}</p>
      </div>

      {/* Compartilhar / Favoritar */}
      <div className="mt-auto flex gap-4 border-t border-border pt-6">
        <span className="text-sm font-medium text-muted-foreground">
          Compartilhar:
        </span>
        <div className="flex gap-3">
          <button
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label="Compartilhar"
          >
            <Share2 className="size-5" />
          </button>
          <button
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label="Favoritar"
          >
            <Heart className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
