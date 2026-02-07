import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/modules/book/schemas/review.schema";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewItemProps {
  review: Review;
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex text-primary">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-current" : "text-muted"}`}
        />
      ))}
    </div>
  );
}

export function ReviewItem({ review }: ReviewItemProps) {
  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-foreground">
              {review.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
        <ReviewStars rating={review.rating} />
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </div>
  );
}
