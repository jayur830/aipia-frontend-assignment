import Back from '@/components/domains/back';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold my-4">AIPIA News</h1>
        <Back />
      </div>
      <Skeleton className="h-12 w-3/4" />
      <hr className="my-4" />
      <Skeleton className="h-12 w-3/4" />
    </div>
  );
}
