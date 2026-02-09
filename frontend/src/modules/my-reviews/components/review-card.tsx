"use client";

import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UserReview } from "../schemas/my-reviews.schema";

interface ReviewCardProps {
  review: UserReview;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 my-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-5 ${
            star <= rating
              ? "text-primary fill-primary"
              : "text-muted-foreground/30 fill-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-bold">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="bg-card rounded-sm p-6 shadow-sm border hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 group">
      {/* Book Cover */}
      <div className="shrink-0 w-32 md:w-40 self-start md:self-center">
        <div className="aspect-2/3 bg-muted rounded-sm overflow-hidden shadow-md relative group-hover:-translate-y-1 transition-transform duration-300 ease-out">
          {review.book.coverUrl ? (
            <Image
              src={review.book.coverUrl}
              alt={`Capa de ${review.book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 160px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <span className="text-xs text-center px-2">Sem capa</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {review.book.category && (
                <Badge variant="secondary" className="text-xs">
                  {review.book.category.name}
                </Badge>
              )}
            </div>
            <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
              {review.book.title}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {review.book.author}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} />

        {/* Comment */}
        <div className="relative">
          <span className="absolute -left-3 -top-2 text-4xl text-muted-foreground/20 font-serif opacity-50">
            &ldquo;
          </span>
          <p className="font-serif text-muted-foreground leading-relaxed text-lg pl-4 border-l-2 border-primary/20 line-clamp-3">
            {review.comment}
          </p>
        </div>

        <div className="mt-2 pt-4 border-t border-dashed flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Avaliado em {formattedDate}
          </span>
          <Link
            href={`/books/${review.bookId}`}
            className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            Ler review completo <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
