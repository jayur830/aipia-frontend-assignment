import dayjs from 'dayjs';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import Back from '@/components/domains/back';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  const data = await response.json() as {
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    text: string;
    time: number;
    title: string;
    type: string;
    url: string;
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold my-4">AIPIA News</h1>
        <Back />
      </div>
      <h2 className="text-2xl font-bold">{data.title}</h2>
      <i>{data.by}</i>
      <p className="text-[14px]">{dayjs(data.time * 1000).format('YYYY-MM-DD')}</p>
      <hr className="my-4" />
      <p>score: {data.score}</p>
      {data.url && (
        <p>
          Link: <Link href={data.url} passHref target="_blank"><Button size="sm" variant="outline"><ExternalLink size={16} /></Button></Link>
        </p>
      )}
      {data.text && <Card className="whitespace-pre-line mt-3 px-3" dangerouslySetInnerHTML={{ __html: data.text }} />}
    </div>
  );
}
