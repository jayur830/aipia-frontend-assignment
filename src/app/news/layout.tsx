import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex justify-center min-h-screen">
      <div className="flex flex-col w-full max-w-[1440px] p-3">
        <h1 className="text-4xl font-bold my-4">AIPIA News</h1>
        {children}
      </div>
    </main>
  );
}
