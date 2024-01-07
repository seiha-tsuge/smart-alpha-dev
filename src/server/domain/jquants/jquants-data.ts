export class JQuantsData {
  private id: string;
  private refreshToken: string;
  private idToken: string;
  private refreshTokenExpiresAt: Date;
  private idTokenExpiresAt: Date;
  public constructor(props: {
    id: string;
    refreshToken: string;
    idToken: string;
    refreshTokenExpiresAt: Date;
    idTokenExpiresAt: Date;
  }) {
    const {
      id,
      refreshToken,
      idToken,
      refreshTokenExpiresAt,
      idTokenExpiresAt,
    } = props;
    this.id = id;
    this.refreshToken = refreshToken;
    this.idToken = idToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    this.idTokenExpiresAt = idTokenExpiresAt;
  }

  public getAllProperties() {
    return {
      id: this.id,
      refreshToken: this.refreshToken,
      idToken: this.idToken,
      refreshTokenExpiresAt: this.refreshTokenExpiresAt,
      idTokenExpiresAt: this.idTokenExpiresAt,
    };
  }
}
