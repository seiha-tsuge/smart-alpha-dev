export class JQuantsDataDTO {
  private id: number;
  private refreshToken: string;
  private idToken: string;
  private refreshTokenExpiresAt: Date;
  private idTokenExpiresAt: Date;
  private updatedAt: Date;
  public constructor(props: {
    id: number;
    refreshToken: string;
    idToken: string;
    refreshTokenExpiresAt: Date;
    idTokenExpiresAt: Date;
    updatedAt: Date;
  }) {
    const { id, refreshToken, idToken, refreshTokenExpiresAt, idTokenExpiresAt, updatedAt } = props;
    this.id = id;
    this.refreshToken = refreshToken;
    this.idToken = idToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    this.idTokenExpiresAt = idTokenExpiresAt;
    this.updatedAt = updatedAt;
  }

  public getAllProperties() {
    return {
      id: this.id,
      refreshToken: this.refreshToken,
      idToken: this.idToken,
      refreshTokenExpiresAt: this.refreshTokenExpiresAt,
      idTokenExpiresAt: this.idTokenExpiresAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface IJQuantsDataQS {
  getUnique(): Promise<JQuantsDataDTO | null>;
}
