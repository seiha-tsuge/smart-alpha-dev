import type { IJQuantsApi } from "@/server/infra/api/jquants/interfaces";
import { JQuantsData } from "@/server/domain/jquants/jquants-data";
import type { IJQuantsDataRepository } from "@/server/domain/jquants/jquants-data-repository";
import { createRandomIdNumber } from "@/utils/random";

export class PostTokenUseCase {
  private readonly jQuantsApi: IJQuantsApi;
  private readonly jQuantsDataRepo: IJQuantsDataRepository;

  public constructor(
    jQuantsApi: IJQuantsApi,
    jQuantsDataRepo: IJQuantsDataRepository
  ) {
    this.jQuantsApi = jQuantsApi;
    this.jQuantsDataRepo = jQuantsDataRepo;
  }

  public async createToken() {
    const { refreshToken, refreshTokenExpiresAt } =
      await this.jQuantsApi.getRefreshToken();

    const { idToken, idTokenExpiresAt } = await this.jQuantsApi.getIdToken(
      refreshToken
    );

    const jQuantsDataEntity = new JQuantsData({
      id: createRandomIdNumber(),
      refreshToken,
      refreshTokenExpiresAt,
      idToken,
      idTokenExpiresAt,
    });

    const savedJQuantsDataEntity = await this.jQuantsDataRepo.create(
      jQuantsDataEntity
    );

    return savedJQuantsDataEntity;
  }

  public async updateRefreshToken(jQuantsData: JQuantsData) {
    const { refreshToken, refreshTokenExpiresAt } =
      await this.jQuantsApi.getRefreshToken();

    const { id, idToken, idTokenExpiresAt } = jQuantsData.getAllProperties();
    const jQuantsDataEntity = new JQuantsData({
      id,
      refreshToken,
      refreshTokenExpiresAt,
      idToken,
      idTokenExpiresAt,
    });

    const savedJQuantsDataEntity = await this.jQuantsDataRepo.save(
      jQuantsDataEntity
    );

    return savedJQuantsDataEntity;
  }

  public async updateIdToken(jQuantsData: JQuantsData) {
    const { id, refreshToken, refreshTokenExpiresAt } =
      jQuantsData.getAllProperties();
    const { idToken, idTokenExpiresAt } = await this.jQuantsApi.getIdToken(
      refreshToken
    );

    const jQuantsDataEntity = new JQuantsData({
      id,
      refreshToken,
      refreshTokenExpiresAt,
      idToken,
      idTokenExpiresAt,
    });

    const savedJQuantsDataEntity = await this.jQuantsDataRepo.save(
      jQuantsDataEntity
    );

    return savedJQuantsDataEntity;
  }
}
