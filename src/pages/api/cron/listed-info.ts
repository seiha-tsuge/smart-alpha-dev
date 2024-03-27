import { db } from '@/server/db';
import { JQuantsApi } from '@/server/infra/api/jquants';
import { JQuantsDataRepository } from '@/server/infra/db/repository/jquants/jquants-data-repository';
import { PostTokenUseCase } from '@/server/app/jquants/post-token-usecase';
import { type Prisma } from '@prisma/client';

import { JQuantsDataQS } from '@/server/infra/db/query-service/jquants/jquants-data-qs';
import { GetTokenUseCase } from '@/server/app/jquants/get-token-usecase';

import { JQuantsData } from '@/server/domain/jquants/jquants-data';

import { subtractMinuteFromDate, isAfterDate } from '@/utils/date';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const jQuantsApi = new JQuantsApi();
  const jQuantsDataRepo = new JQuantsDataRepository(db);
  const postTokenUseCase = new PostTokenUseCase(jQuantsApi, jQuantsDataRepo);

  let JQuantsDataEntity: JQuantsData;

  const jQuantsDataQS = new JQuantsDataQS(db);
  const getTokenUseCase = new GetTokenUseCase(jQuantsDataQS);
  const jQuantsDataDTO = await getTokenUseCase.getToken();
  if (jQuantsDataDTO) {
    JQuantsDataEntity = new JQuantsData({ ...jQuantsDataDTO.getAllProperties() });
  } else {
    // データがない場合は、新規に作成する
    JQuantsDataEntity = await postTokenUseCase.createToken();
  }

  const { refreshTokenExpiresAt, idTokenExpiresAt } = JQuantsDataEntity.getAllProperties();
  if (isAfterDate(subtractMinuteFromDate(new Date(), 10), refreshTokenExpiresAt)) {
    JQuantsDataEntity = await postTokenUseCase.updateRefreshToken(JQuantsDataEntity);
  }
  if (isAfterDate(subtractMinuteFromDate(new Date(), 10), idTokenExpiresAt)) {
    JQuantsDataEntity = await postTokenUseCase.updateIdToken(JQuantsDataEntity);
  }

  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  const formattedDate = sixMonthsAgo.toISOString().slice(0, 10);
  const financialStatements = await jQuantsApi.getFinancialStatements({
    idToken: JQuantsDataEntity.getAllProperties().idToken,
    date: formattedDate,
  });

  const statements: Prisma.StatementsCreateManyInput[] = financialStatements.statements.map((statement) => {
    return {
      disclosed_date: statement.DisclosedDate,
      disclosed_time: statement.DisclosedTime,
      local_code: statement.LocalCode,
      disclosure_number: statement.DisclosureNumber,
      type_of_document: statement.TypeOfDocument,
      type_of_current_period: statement.TypeOfCurrentPeriod,
      current_period_start_date: statement.CurrentPeriodStartDate,
      current_period_end_date: statement.CurrentPeriodEndDate,
      current_fiscal_year_start_date: statement.CurrentFiscalYearStartDate,
      current_fiscal_year_end_date: statement.CurrentFiscalYearEndDate,
    };
  });

  await db.statements.createMany({ data: statements });

  return response.status(200).json(financialStatements);
}
