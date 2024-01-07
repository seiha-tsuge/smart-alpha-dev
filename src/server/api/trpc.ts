/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

import { JQuantsApi } from "@/server/infra/api/jquants";
import { JQuantsDataRepository } from "@/server/infra/db/repository/jquants/jquants-data-repository";
import { PostTokenUseCase } from "@/server/app/jquants/post-token-usecase";

import { JQuantsDataQS } from "@/server/infra/db/query-service/jquants/jquants-data-qs";
import { GetTokenUseCase } from "@/server/app/jquants/get-token-usecase";

import { JQuantsData } from "@/server/domain/jquants/jquants-data";

import { subtractMinuteFromDate, isAfterDate } from "@/utils/date";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface CreateContextOptions {
  session: Session | null;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Mark the function as async
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const jQuantsApi = new JQuantsApi();
  const jQuantsDataRepo = new JQuantsDataRepository(ctx.db);
  const postTokenUseCase = new PostTokenUseCase(jQuantsApi, jQuantsDataRepo);

  let JQuantsDataEntity: JQuantsData;

  const jQuantsDataQS = new JQuantsDataQS(ctx.db);
  const getTokenUseCase = new GetTokenUseCase(jQuantsDataQS);
  const jQuantsDataDTO = await getTokenUseCase.getToken();
  if (jQuantsDataDTO) {
    JQuantsDataEntity = new JQuantsData({
      ...jQuantsDataDTO.getAllProperties(),
    });
  } else {
    // データがない場合は、新規に作成する
    JQuantsDataEntity = await postTokenUseCase.createToken();
  }

  const { refreshTokenExpiresAt, idTokenExpiresAt } =
    JQuantsDataEntity.getAllProperties();
  if (
    isAfterDate(
      refreshTokenExpiresAt,
      subtractMinuteFromDate(refreshTokenExpiresAt, 10)
    )
  ) {
    JQuantsDataEntity = await postTokenUseCase.updateRefreshToken(
      JQuantsDataEntity
    );
  }
  if (
    isAfterDate(idTokenExpiresAt, subtractMinuteFromDate(idTokenExpiresAt, 10))
  ) {
    JQuantsDataEntity = await postTokenUseCase.updateIdToken(JQuantsDataEntity);
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
