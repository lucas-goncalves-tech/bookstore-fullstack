"use client";

import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMyReviews } from "../hooks/use-my-reviews";
import { ReviewStats } from "./review-stats";
import { ReviewCard } from "./review-card";
import { MyReviewsResponse } from "../schemas/my-reviews.schema";

interface ReviewListProps {
  initialData?: MyReviewsResponse | null;
}

export function ReviewList({ initialData }: ReviewListProps) {
  const { data, isLoading } = useMyReviews(initialData);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <Star className="size-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-muted-foreground mb-4">
          Você ainda não avaliou nenhum livro.
        </p>
        <Button asChild>
          <Link href="/">Explorar livros</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ReviewStats
        totalReviews={data.totalReviews}
        averageRating={data.averageRating}
      />
      <div className="flex flex-col gap-6">
        {data.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </>
  );
}
