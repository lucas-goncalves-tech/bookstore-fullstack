"use client";

import { useBookReviews } from "../hooks/use-reviews";
import { ReviewItem } from "./review-item";
import { ReviewForm } from "./review-form";
import { useUser } from "@/hooks/use-user";
import { Star, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-12 mt-12">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="mb-8">
          <Skeleton className="h-[168px] w-full" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>
          ))}
        </div>
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

      {!mounted ? (
        <div className="mb-8">
          <Skeleton className="h-[168px] w-full" />
        </div>
      ) : isAuthenticated ? (
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
