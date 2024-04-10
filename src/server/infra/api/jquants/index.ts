import { TRPCError } from '@trpc/server';
import { env } from '@/env';
import { addDaysToDate } from '@/utils/date';

import type {
  IJQuantsApi,
  ErrorResponse,
  GetRefreshTokenResponse,
  GetRefreshTokenData,
  GetIdTokenResponse,
  GetIdTokenData,
  GetFinancialStatementsRequest,
  GetFinancialStatementsResponse,
  GetListedInfoRequest,
  GetListedInfoResponse,
} from './interfaces';

export class JQuantsApi implements IJQuantsApi {
  public async getRefreshToken(): Promise<GetRefreshTokenResponse> {
    const url = 'https://api.jquants.com/v1/token/auth_user';
    const body = JSON.stringify({
      mailaddress: env.J_QUANTS_ID,
      password: env.J_QUANTS_SECRET,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: errorData.message,
        });
      }

      const data = (await response.json()) as GetRefreshTokenData;
      return {
        refreshToken: data.refreshToken,
        refreshTokenExpiresAt: addDaysToDate(new Date(), 7),
      };
    } catch (error) {
      throw error;
    }
  }

  public async getIdToken(refreshToken: string): Promise<GetIdTokenResponse> {
    const url = `https://api.jquants.com/v1/token/auth_refresh?refreshtoken=${refreshToken}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: errorData.message,
        });
      }

      const data = (await response.json()) as GetIdTokenData;
      return {
        idToken: data.idToken,
        idTokenExpiresAt: addDaysToDate(new Date(), 1),
      };
    } catch (error) {
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

    if (code) params.append('code', code);
    if (date) params.append('date', date);
    if (pagination_key) params.append('pagination_key', pagination_key);

    const url = `https://api.jquants.com/v1/fins/statements?${params.toString()}`;
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    try {
      const response = await fetch(url, { headers, method: 'GET' });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;

        if (response.status === 400) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: errorData.message,
          });
        }

        if (response.status === 401) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: errorData.message,
          });
        }

        if (response.status === 403) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: errorData.message,
          });
        }

        if (response.status === 413) {
          throw new TRPCError({
            code: 'PAYLOAD_TOO_LARGE',
            message: errorData.message,
          });
        }

        if (response.status === 500) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: errorData.message,
          });
        }
      }

      const data = (await response.json()) as GetFinancialStatementsResponse;
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getListedInfo({ idToken, code, date }: GetListedInfoRequest): Promise<GetListedInfoResponse> {
    const params = new URLSearchParams();

    if (code) params.append('code', code);
    if (date) params.append('date', date);

    const url = `https://api.jquants.com/v1/listed/info?${params.toString()}`;
    const headers = {
      Authorization: `Bearer ${idToken}`,
    };

    try {
      const response = await fetch(url, { headers, method: 'GET' });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;

        if (response.status === 400) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: errorData.message,
          });
        }

        if (response.status === 401) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: errorData.message,
          });
        }

        if (response.status === 403) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: errorData.message,
          });
        }

        if (response.status === 413) {
          throw new TRPCError({
            code: 'PAYLOAD_TOO_LARGE',
            message: errorData.message,
          });
        }

        if (response.status === 500) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: errorData.message,
          });
        }
      }

      const data = (await response.json()) as GetListedInfoResponse;
      return data;
    } catch (error) {
      throw error;
    }
  }
}
