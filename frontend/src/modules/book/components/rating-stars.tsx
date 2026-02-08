import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showHalfStars?: boolean;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function RatingStars({
  rating = 0,
  size = "md",
  showHalfStars = true,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = showHalfStars && rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClass = sizeClasses[size];

  return (
    <div className="flex text-primary">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn(sizeClass, "fill-current")} />
      ))}
      {hasHalfStar && <StarHalf className={cn(sizeClass, "fill-current")} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeClass, "text-muted-foreground")}
        />
      ))}
    </div>
  );
}
