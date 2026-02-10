import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSales() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40 rounded-lg" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}
