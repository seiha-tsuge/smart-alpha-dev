import type {
  IJQuantsApi,
  ErrorResponse,
  GetRefreshTokenResponse,
  GetRefreshTokenData,
  GetIdTokenResponse,
  GetIdTokenData,
  GetFinancialStatementsRequest,
  GetFinancialStatementsResponse,
} from "./interfaces";
import { env } from "@/env";
import { addDaysToDate } from "@/utils/date";

export class JQuantsApi implements IJQuantsApi {
  public async getRefreshToken(): Promise<GetRefreshTokenResponse> {
    const url = "https://api.jquants.com/v1/token/auth_user";
    const body = JSON.stringify({
      mailaddress: env.J_QUANTS_ID,
      password: env.J_QUANTS_SECRET,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.message);
      }

      const data = (await response.json()) as GetRefreshTokenData;
      return {
        refreshToken: data.refreshToken,
        refreshTokenExpiresAt: addDaysToDate(new Date(), 7),
      };
    } catch (error) {
      console.error("Error fetching auth token:", error);
      throw error;
    }
  }

  public async getIdToken(refreshToken: string): Promise<GetIdTokenResponse> {
    const url = `https://api.jquants.com/v1/token/auth_refresh?refreshtoken=${refreshToken}`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.message);
      }

      const data = (await response.json()) as GetIdTokenData;
      return {
        idToken: data.idToken,
        idTokenExpiresAt: addDaysToDate(new Date(), 1),
      };
    } catch (error) {
      console.error("Error fetching auth token:", error);
      throw error;
    }
  }

  public async getFinancialStatements({
    idToken,
    code,
    date,
    pagination_key,
  }: GetFinancialStatementsRequest): Promise<GetFinancialStatementsResponse> {
    const params = new URLSearchParams();

    if (code) params.append("code", code);
    if (date) params.append("date", date);
    if (pagination_key) params.append("pagination_key", pagination_key);

    const url = `https://api.jquants.com/v1/fins/statements?${params.toString()}`;
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.message);
      }

      const data = (await response.json()) as GetFinancialStatementsResponse;
      return data;
    } catch (error) {
      console.error("Error fetching auth token:", error);
      throw error;
    }
  }
}
