'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState<number>(pageParam);

  const fetchStories = useCallback(async () => {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/${tab}stories.json`);
    if (!response.ok) {
      throw new Error();
    }
    const idList = await response.json() as number[];
    const stories = await Promise.all(idList.slice(0, 10).map(async (id) => {
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
      time: dayjs(time).format('YYYY-MM-DD'),
      url,
    })));
  }, [tab]);

  useEffect(() => {
    fetchStories();
    setPage(1);
    window.history.replaceState(null, '', '?page=1');
  }, [fetchStories]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [page, router, searchParams]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold my-4">AIPIA News</h1>
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
        {stories.slice((page - 1) * LIMIT, page * LIMIT).map(({ id, title, by, time }) => (
          <Card className="flex flex-row" key={id}>
            <CardHeader className="w-12">
              <Image alt="" height={48} src="https://picsum.photos/seed/1/48" unoptimized width={48} />
            </CardHeader>
            <CardContent>
              <h3 className="font-bold text-[20pt]">{title}</h3>
              <i className="text-sm text-gray-500">{by}</i>
              <p className="text-sm">{time}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst onClick={() => setPage(1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                const currentPageGroup = Math.floor((page - 1) / 10);
                if (currentPageGroup > 0) {
                  setPage((currentPageGroup - 1) * 10 + 1);
                }
              }}
            />
          </PaginationItem>
          {(() => {
            const totalPages = Math.ceil(stories.length / LIMIT);
            const currentPageGroup = Math.floor((page - 1) / 10);
            const startPage = currentPageGroup * 10 + 1;
            const endPage = Math.min((currentPageGroup + 1) * 10, totalPages);
            return Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
              const pageNumber = startPage + index;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            });
          })()}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                const totalPages = Math.ceil(stories.length / LIMIT);
                const currentPageGroup = Math.floor((page - 1) / 10);
                if ((currentPageGroup + 1) * 10 < totalPages) {
                  setPage((currentPageGroup + 1) * 10 + 1);
                }
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              onClick={() => {
                const totalPages = Math.ceil(stories.length / LIMIT);
                setPage(totalPages);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
