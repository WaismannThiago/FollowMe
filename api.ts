import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './router';

export const GET = (req: Request) =>
  fetchRequestHandler({ router: appRouter, createContext: () => ({}), req });

export const POST = GET;