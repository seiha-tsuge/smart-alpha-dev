import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

import { JQuantsApi } from '@/server/infra/api/jquants';
import { GetListedInfoUseCase } from '@/server/app/listed-info/get-listed-info-usecase';

export const listedInfoRouter = createTRPCRouter({
  getListedInfo: protectedProcedure
    .input(
      z.object({
        code: z.string().min(4).max(5).optional(),
        date: z.string().min(8).max(10).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const jQuantsApi = new JQuantsApi();
      const getListedInfoUseCase = new GetListedInfoUseCase(jQuantsApi);
      const params = {
        idToken: ctx.idToken,
        code: input.code,
        date: input.date,
      };
      return getListedInfoUseCase.getListedInfo(params);
    }),
});
