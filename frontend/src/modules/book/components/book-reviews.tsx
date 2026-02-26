"use client";

import { useBookReviews } from "../hooks/use-reviews";
import { ReviewItem } from "./review-item";
import { ReviewForm } from "./review-form";
import { useUser } from "@/hooks/use-user";
import { Star, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface BookReviewsProps {
  bookId: string;
}

export function BookReviews({ bookId }: BookReviewsProps) {
  const {
    data: reviewData,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookReviews(bookId);
  const { isAuthenticated } = useUser();
  const { ref, inView } = useInView({
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="mb-12 mt-12 text-center text-muted-foreground">
        Carregando avaliações...
      </div>
    );
  }

  const hasReviews = reviewData && reviewData.pages[0]?.reviews.length > 0;

  return (
    <div className="mb-12 mt-12">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">
          Avaliações de Clientes
        </h3>
        {hasReviews && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">
                {reviewData.pages[0]?.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewData.pages[0]?.totalReviews}{" "}
              {reviewData.pages[0]?.totalReviews === 1 ? "avaliação" : "avaliações"})
            </span>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <div className="mb-8">
          <ReviewForm bookId={bookId} />
        </div>
      ) : (
        !hasReviews && (
          <p className="mb-8 text-muted-foreground">
            Você precisa estar logado para avaliar este livro.
          </p>
        )
      )}

      {hasReviews ? (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {reviewData.pages
              .flatMap((page) => page.reviews)
              .map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
          </div>
          <div
            ref={ref}
            className="mt-8 flex h-10 w-full items-center justify-center p-4"
          >
            {isFetchingNextPage && (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            )}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">
          Este livro ainda não possui avaliações. Seja o primeiro a avaliar!
        </p>
      )}
    </div>
  );
}
