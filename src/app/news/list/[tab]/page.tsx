'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';

import { NewsListSkeleton } from '@/components/domains/news-list-skeleton';
import { NewsPagination } from '@/components/domains/news-pagination';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LIMIT = 10;

interface Story {
  id: number;
  title: string;
  by: string;
  time: string;
  url: string;
}

interface PageProps {
  params: Promise<{
    tab: 'top' | 'new' | 'best';
  }>;
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const { tab } = use(params);

  const [page, setPage] = useState<number>(pageParam);

  const { data: storyIds = [], isLoading: isStoryIdsLoading } = useQuery({
    queryKey: ['/news/list', tab] as const,
    async queryFn({ queryKey: [, tab] }) {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/${tab}stories.json`);
      if (!response.ok) {
        throw new Error();
      }
      return response.json() as Promise<number[]>;
    },
  });

  const { data: stories = [], isLoading: isStoriesLoading } = useQuery({
    queryKey: ['/news/list', page] as const,
    async queryFn({ queryKey: [, page] }) {
      const startIndex = (page - 1) * LIMIT;
      const endIndex = startIndex + LIMIT;
      const pageIds = storyIds.slice(startIndex, endIndex);

      const stories = await Promise.all(pageIds.map(async (id) => {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json() as Promise<{
          id: number;
          title: string;
          by: string;
          time: number;
          url: string;
        }>;
      }));
      return stories.map(({ id, title, by, time, url }): Story => ({
        id,
        title,
        by,
        time: dayjs(time * 1000).format('YYYY-MM-DD'),
        url,
      }));
    },
    enabled: storyIds.length > 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, router, searchParams]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold my-4">AIPIA News</h1>
      <Tabs
        onValueChange={(value) => {
          router.push(`/news/list/${value}?page=1`);
        }}
        value={tab}
      >
        <TabsList>
          <TabsTrigger value="top">Top</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="best">Best</TabsTrigger>
        </TabsList>
      </Tabs>
      <hr />
      {isStoryIdsLoading || isStoriesLoading ? (
        <NewsListSkeleton />
      ) : (
        <div className="flex flex-col gap-2">
          {stories.map(({ id, title, by, time }) => (
            <Link href={`/news/${id}`} key={id} passHref>
              <Card className="cursor-pointer flex flex-row items-center">
                <CardHeader className="w-12">
                  <Image alt={title} className="max-w-12 h-12" height={48} src={`https://picsum.photos/seed/${id}/48`} unoptimized width={48} />
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold text-[20px]">{title}</h3>
                  <i className="text-sm text-gray-500">{by}</i>
                  <p className="text-sm">{time}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <NewsPagination
        itemsPerPage={LIMIT}
        onPageChange={setPage}
        page={page}
        totalItems={storyIds.length}
      />
    </div>
  );
}
