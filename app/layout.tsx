'use client';
import { trpc } from '@/utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React from 'react';

const client = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider
      client={client}
      queryClient={client}
      links={[httpBatchLink({ url: '/api/trpc' })]}
    >
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}