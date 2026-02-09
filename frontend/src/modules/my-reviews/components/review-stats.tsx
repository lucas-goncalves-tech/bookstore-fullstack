"use client";

import { Star } from "lucide-react";

interface ReviewStatsProps {
  totalReviews: number;
  averageRating: number;
}

export function ReviewStats({ totalReviews, averageRating }: ReviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      <div className="bg-card p-6 rounded-sm shadow-sm border flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">
            Total de Reviews
          </p>
          <p className="text-3xl font-serif font-bold">{totalReviews}</p>
        </div>
        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-primary/80">
          <Star className="size-6 fill-current" />
        </div>
      </div>
      <div className="bg-card p-6 rounded-sm shadow-sm border flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">
            Média
          </p>
          <p className="text-3xl font-serif font-bold flex items-center gap-1">
            {averageRating.toFixed(1)}
            <Star className="size-5 text-primary fill-primary" />
          </p>
        </div>
      </div>
    </div>
  );
}
