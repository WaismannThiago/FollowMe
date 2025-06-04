// server/routers/appRouter.ts
import { router } from '@trpc/server';
import { taskRouter } from './taskRouter';
import type { Context } from '../context';

export const appRouter = router<Context>().merge('task.', taskRouter);
