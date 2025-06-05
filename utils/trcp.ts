import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers'; // Alterado para import absoluto

export const trpc = createTRPCReact<AppRouter>();
