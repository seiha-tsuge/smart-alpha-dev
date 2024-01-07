import type { IJQuantsDataQS } from "./query-service-interface/jquants-data-qs";

export class GetTokenUseCase {
  private readonly jQuantsDataQS: IJQuantsDataQS;
  public constructor(jQuantsDataQS: IJQuantsDataQS) {
    this.jQuantsDataQS = jQuantsDataQS;
  }

  public async getToken() {
    try {
      return await this.jQuantsDataQS.getUnique();
    } catch (error) {
      throw error;
    }
  }
}
