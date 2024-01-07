import type { PrismaClient } from "@prisma/client";
import type { IJQuantsDataRepository } from "@/server/domain/jquants/jquants-data-repository";
import { JQuantsData } from "@/server/domain/jquants/jquants-data";

export class JQuantsDataRepository implements IJQuantsDataRepository {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async create(jQuantsDataEntity: JQuantsData): Promise<JQuantsData> {
    const { refreshToken, idToken, refreshTokenExpiresAt, idTokenExpiresAt } =
      jQuantsDataEntity.getAllProperties();

    const savedJQuantsDataModel = await this.prismaClient.jQuants.create({
      data: {
        refresh_token: refreshToken,
        refresh_token_expires_at: refreshTokenExpiresAt,
        id_token: idToken,
        id_token_expires_at: idTokenExpiresAt,
      },
    });

    const savedJQuantsDataEntity = new JQuantsData({
      id: savedJQuantsDataModel.id,
      refreshToken: savedJQuantsDataModel.refresh_token,
      idToken: savedJQuantsDataModel.id_token,
      refreshTokenExpiresAt: savedJQuantsDataModel.refresh_token_expires_at,
      idTokenExpiresAt: savedJQuantsDataModel.id_token_expires_at,
    });

    return savedJQuantsDataEntity;
  }

  public async save(jQuantsDataEntity: JQuantsData): Promise<JQuantsData> {
    const {
      id,
      refreshToken,
      idToken,
      refreshTokenExpiresAt,
      idTokenExpiresAt,
    } = jQuantsDataEntity.getAllProperties();

    const savedJQuantsDataModel = await this.prismaClient.jQuants.update({
      where: { id },
      data: {
        refresh_token: refreshToken,
        refresh_token_expires_at: refreshTokenExpiresAt,
        id_token: idToken,
        id_token_expires_at: idTokenExpiresAt,
      },
    });

    const savedJQuantsDataEntity = new JQuantsData({
      id: savedJQuantsDataModel.id,
      refreshToken: savedJQuantsDataModel.refresh_token,
      idToken: savedJQuantsDataModel.id_token,
      refreshTokenExpiresAt: savedJQuantsDataModel.refresh_token_expires_at,
      idTokenExpiresAt: savedJQuantsDataModel.id_token_expires_at,
    });

    return savedJQuantsDataEntity;
  }
}
