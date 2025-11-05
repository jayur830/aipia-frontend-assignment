import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function NewsListSkeleton() {
  return (
    <>
      {/* News List */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card className="flex flex-row items-center" key={index}>
            <CardHeader className="w-12">
              <Skeleton className="max-w-12 h-12" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center gap-2 items-center">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-10 w-10" key={index} />
        ))}
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </>
  );
}
