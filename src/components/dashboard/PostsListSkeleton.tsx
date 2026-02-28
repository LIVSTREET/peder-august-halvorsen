import { Skeleton } from "@/components/ui/skeleton";

export function PostsListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3 px-4 border border-border rounded-md">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-[130px]" />
        </div>
      ))}
    </div>
  );
}
