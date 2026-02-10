import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonReviews() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      {/* Reviews List Skeleton */}
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-6 p-6 border rounded-lg bg-card"
          >
            <Skeleton className="size-24 rounded-lg md:w-32 md:h-48 shrink-0" />
            <div className="flex flex-col flex-1 gap-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
