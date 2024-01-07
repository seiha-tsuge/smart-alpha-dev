import type { IJQuantsApi } from '@/server/infra/api/jquants/interfaces';

export class GetFinsStatementsUseCase {
  private readonly jQuantsApi: IJQuantsApi;

  public constructor(jQuantsApi: IJQuantsApi) {
    this.jQuantsApi = jQuantsApi;
  }

  public async getFinsStatements(params: { idToken: string; code?: string; date?: string; paginationKey?: string }) {
    return await this.jQuantsApi.getFinancialStatements(params);
  }
}
