import { Skeleton } from "./ui/skeleton";

export function ClothingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full rounded-none" />
      
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1 mt-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
