'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

export default function Back() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="ghost">
      <ArrowLeft />
    </Button>
  );
}
