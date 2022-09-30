// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { nhentaiRouter } from './nhentai';
import { javActressRouter } from './jav-actress';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('nhentai.', nhentaiRouter)
  .merge('jav-actress.', javActressRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
