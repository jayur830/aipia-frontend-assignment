'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [tab, setTab] = useState<'top' | 'new' | 'best'>('top');
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState<number>(pageParam);

  const fetchStoryIds = useCallback(async () => {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/${tab}stories.json`);
    if (!response.ok) {
      throw new Error();
    }
    const idList = await response.json() as number[];
    setStoryIds(idList);
  }, [tab]);

  const fetchPageStories = useCallback(async () => {
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
    setStories(stories.map(({ id, title, by, time, url }) => ({
      id,
      title,
      by,
      time: dayjs(time * 1000).format('YYYY-MM-DD'),
      url,
    })));
  }, [page, storyIds]);

  useEffect(() => {
    fetchStoryIds();
    setPage(1);
    window.history.replaceState(null, '', '?page=1');
  }, [tab, fetchStoryIds]);

  useEffect(() => {
    if (storyIds.length > 0) {
      fetchPageStories();
    }
  }, [page, storyIds, fetchPageStories]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, router, searchParams]);

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        defaultValue="top"
        onValueChange={(value) => {
          setTab(value as 'top' | 'new' | 'best');
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
      <div className="flex flex-col gap-2">
        {stories.map(({ id, title, by, time }) => (
          <Link href={`news/${id}`} key={id} passHref>
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
      <NewsPagination
        itemsPerPage={LIMIT}
        onPageChange={setPage}
        page={page}
        totalItems={storyIds.length}
      />
    </div>
  );
}
