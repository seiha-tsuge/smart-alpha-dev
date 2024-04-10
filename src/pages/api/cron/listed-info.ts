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

  const listedInfo = await jQuantsApi.getListedInfo({
    idToken: JQuantsDataEntity.getAllProperties().idToken,
  });

  const listedInfoCreateManyInput: Prisma.ListedInfoCreateManyInput[] = listedInfo.info.map((info) => {
    return {
      Date: info.Date,
      Code: info.Code,
      CompanyName: info.CompanyName,
      CompanyNameEnglish: info.CompanyNameEnglish,
      Sector17Code: info.Sector17Code,
      Sector17CodeName: info.Sector17CodeName,
      Sector33Code: info.Sector33Code,
      Sector33CodeName: info.Sector33CodeName,
      ScaleCategory: info.ScaleCategory,
      MarketCode: info.MarketCode,
      MarketCodeName: info.MarketCodeName,
    };
  });

  await db.listedInfo.createMany({ data: listedInfoCreateManyInput });

  return response.status(200).json(listedInfo);
}
