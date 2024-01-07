import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

import { JQuantsApi } from '@/server/infra/api/jquants';
import { GetFinsStatementsUseCase } from '@/server/app/fins-statements/get-fins-statements-usecase';

export const finsStatementsRouter = createTRPCRouter({
  getFinsStatements: protectedProcedure
    .input(
      z.object({
        code: z.string().min(4).max(5).optional(),
        date: z.string().min(8).max(10).optional(),
        paginationKey: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const jQuantsApi = new JQuantsApi();
      const getFinsStatementsUseCase = new GetFinsStatementsUseCase(jQuantsApi);
      const params = {
        idToken: ctx.idToken,
        code: input.code,
        date: input.date,
        paginationKey: input.paginationKey,
      };
      return getFinsStatementsUseCase.getFinsStatements(params);
    }),
});
