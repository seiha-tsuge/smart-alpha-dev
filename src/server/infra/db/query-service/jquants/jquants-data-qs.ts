import type { PrismaClient } from '@prisma/client';
import { JQuantsDataDTO } from '@/server/app/jquants/query-service-interface/jquants-data-qs';
import type { IJQuantsDataQS } from '@/server/app/jquants/query-service-interface/jquants-data-qs';

export class JQuantsDataQS implements IJQuantsDataQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getUnique(): Promise<JQuantsDataDTO | null> {
    const jQuantsData = await this.prismaClient.jQuants.findUnique({
      where: { id: 1 },
    });

    if (jQuantsData === null) {
      return null;
    }

    return new JQuantsDataDTO({
      id: jQuantsData.id,
      refreshToken: jQuantsData.refresh_token,
      idToken: jQuantsData.id_token,
      refreshTokenExpiresAt: jQuantsData.refresh_token_expires_at,
      idTokenExpiresAt: jQuantsData.id_token_expires_at,
      updatedAt: jQuantsData.updatedAt,
    });
  }
}
