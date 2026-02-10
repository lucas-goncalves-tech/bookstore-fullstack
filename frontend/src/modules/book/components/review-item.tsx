import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/modules/book/schemas/review.schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RatingStars } from "./rating-stars";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
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
        <RatingStars rating={review.rating} size="sm" showHalfStars={false} />
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </div>
  );
}
