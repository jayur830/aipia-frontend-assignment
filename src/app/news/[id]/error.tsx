'use client';

import Back from '@/components/domains/back';

export interface ErrorProps {
  error: Error;
  reset(): void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold my-4">AIPIA News</h1>
        <Back />
      </div>
      <h2 className="text-2xl font-bold">{error.message}</h2>
    </div>
  );
}
