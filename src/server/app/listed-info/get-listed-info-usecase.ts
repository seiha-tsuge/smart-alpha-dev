import type { IJQuantsApi } from '@/server/infra/api/jquants/interfaces';

export class GetListedInfoUseCase {
  private readonly jQuantsApi: IJQuantsApi;

  public constructor(jQuantsApi: IJQuantsApi) {
    this.jQuantsApi = jQuantsApi;
  }

  public async getListedInfo(params: { idToken: string; code?: string; date?: string }) {
    return await this.jQuantsApi.getListedInfo(params);
  }
}
