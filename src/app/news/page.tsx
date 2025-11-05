'use client';

import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LIMIT = 10;

export default function Page() {
  const [tab, setTab] = useState<'top' | 'new' | 'best'>('top');
  const [stories, setStories] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageGroup, setPageGroup] = useState<number>(0);

  useEffect(() => {
    fetch(`https://hacker-news.firebaseio.com/v0/${tab}stories.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(setStories);
    setPage(1);
    setPageGroup(0);
  }, [tab]);

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
        {stories.slice((page - 1) * LIMIT, page * LIMIT).map((storyId) => (
          <Card key={storyId}>{storyId}</Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              onClick={() => {
                setPageGroup(0);
                setPage(1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (pageGroup > 0) {
                  setPageGroup(pageGroup - 1);
                  setPage(pageGroup * 10);
                }
              }}
            />
          </PaginationItem>
          {(() => {
            const totalPages = Math.ceil(stories.length / LIMIT);
            const startPage = pageGroup * 10 + 1;
            const endPage = Math.min((pageGroup + 1) * 10, totalPages);
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
                if ((pageGroup + 1) * 10 < totalPages) {
                  setPageGroup(pageGroup + 1);
                  setPage((pageGroup + 1) * 10 + 1);
                }
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              onClick={() => {
                const totalPages = Math.ceil(stories.length / LIMIT);
                const lastPageGroup = Math.floor((totalPages - 1) / 10);
                setPageGroup(lastPageGroup);
                setPage(totalPages);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
