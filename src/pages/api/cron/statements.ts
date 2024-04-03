import { db } from '@/server/db';
import { type Prisma } from '@prisma/client';
import { JQuantsApi } from '@/server/infra/api/jquants';
import { JQuantsDataRepository } from '@/server/infra/db/repository/jquants/jquants-data-repository';
import { PostTokenUseCase } from '@/server/app/jquants/post-token-usecase';

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
      next_fiscal_year_start_date: statement.NextFiscalYearStartDate,
      next_fiscal_year_end_date: statement.NextFiscalYearEndDate,
      net_sales: statement.NetSales !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      operating_profit:
        statement.OperatingProfit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      ordinary_profit:
        statement.OrdinaryProfit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      profit: statement.Profit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      earnings_per_share:
        statement.EarningsPerShare !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      diluted_earnings_per_share:
        statement.DilutedEarningsPerShare !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      total_assets: statement.TotalAssets !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      equity: statement.Equity !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      equity_to_asset_ratio:
        statement.EquityToAssetRatio !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      book_value_per_share:
        statement.BookValuePerShare !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      cash_flows_from_operating_activities:
        statement.CashFlowsFromOperatingActivities !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      cash_flows_from_investing_activities:
        statement.CashFlowsFromInvestingActivities !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      cash_flows_from_financing_activities:
        statement.CashFlowsFromFinancingActivities !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      cash_and_equivalents:
        statement.CashAndEquivalents !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      result_dividend_per_share_1st_q:
        statement.ResultDividendPerShare1stQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      result_dividend_per_share_2nd_q:
        statement.ResultDividendPerShare2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      result_dividend_per_share_3rd_q:
        statement.ResultDividendPerShare3rdQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      result_dividend_per_share_fiscal_year_end:
        statement.ResultDividendPerShareFiscalYearEnd !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      result_dividend_per_share_annual:
        statement.ResultDividendPerShareAnnual !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      distributions_per_unit:
        statement.DistributionsPerUnit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      result_total_dividend_paid_annual:
        statement.ResultTotalDividendPaidAnnual !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      result_payout_ratio_annual:
        statement.ResultPayoutRatioAnnual !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      forecast_dividend_per_share_1st_q:
        statement.ForecastDividendPerShare1stQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_dividend_per_share_2nd_q:
        statement.ForecastDividendPerShare2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_dividend_per_share_3rd_q:
        statement.ForecastDividendPerShare3rdQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_dividend_per_share_fiscal_year_end:
        statement.ForecastDividendPerShareFiscalYearEnd !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_dividend_per_share_annual:
        statement.ForecastDividendPerShareAnnual !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_distributions_per_unit:
        statement.ForecastDistributionsPerUnit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_total_dividend_paid_annual:
        statement.ForecastTotalDividendPaidAnnual !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_payout_ratio_annual:
        statement.ForecastPayoutRatioAnnual !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      next_year_forecast_dividend_per_share_1st_q:
        statement.NextYearForecastDividendPerShare1stQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_dividend_per_share_2nd_q:
        statement.NextYearForecastDividendPerShare2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_dividend_per_share_3rd_q:
        statement.NextYearForecastDividendPerShare3rdQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_dividend_per_share_fiscal_year_end:
        statement.NextYearForecastDividendPerShareFiscalYearEnd !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_dividend_per_share_annual:
        statement.NextYearForecastDividendPerShareAnnual !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_distributions_per_unit:
        statement.NextYearForecastDistributionsPerUnit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_payout_ratio_annual:
        statement.NextYearForecastPayoutRatioAnnual !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_net_sales_2nd_q:
        statement.ForecastNetSales2ndQuarter !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      forecast_operating_profit_2nd_q:
        statement.ForecastOperatingProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_ordinary_profit_2nd_q:
        statement.ForecastOrdinaryProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_profit_2nd_q:
        statement.ForecastProfit2ndQuarter !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      forecast_earnings_per_share_2nd_q:
        statement.ForecastEarningsPerShare2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_net_sales_2nd_q:
        statement.NextYearForecastNetSales2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_operating_profit_2nd_q:
        statement.NextYearForecastOperatingProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_ordinary_profit_2nd_q:
        statement.NextYearForecastOrdinaryProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_profit_2nd_q:
        statement.NextYearForecastProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_earnings_per_share_2nd_q:
        statement.NextYearForecastEarningsPerShare2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_net_sales:
        statement.ForecastNetSales !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      forecast_operating_profit:
        statement.ForecastOperatingProfit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      forecast_ordinary_profit:
        statement.ForecastOrdinaryProfit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      forecast_profit:
        statement.ForecastProfit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      forecast_earnings_per_share:
        statement.ForecastEarningsPerShare !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      next_year_forecast_net_sales:
        statement.NextYearForecastNetSales !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      next_year_forecast_operating_profit:
        statement.NextYearForecastOperatingProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_ordinary_profit:
        statement.NextYearForecastOrdinaryProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_profit:
        statement.NextYearForecastProfit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      next_year_forecast_earnings_per_share:
        statement.NextYearForecastEarningsPerShare !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      material_changes_in_subsidiaries:
        statement.MaterialChangesInSubsidiaries !== undefined
          ? Boolean(statement.CashFlowsFromOperatingActivities)
          : null,
      changes_based_on_revisions_of_accounting_standard:
        statement.ChangesBasedOnRevisionsOfAccountingStandard !== undefined
          ? Boolean(statement.CashFlowsFromOperatingActivities)
          : null,
      non_standard_revisions:
        statement.ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard !== undefined
          ? Boolean(statement.CashFlowsFromOperatingActivities)
          : null,
      changes_in_accounting_estimates:
        statement.ChangesInAccountingEstimates !== undefined
          ? Boolean(statement.CashFlowsFromOperatingActivities)
          : null,
      retrospective_restatement:
        statement.RetrospectiveRestatement !== undefined ? Boolean(statement.CashFlowsFromOperatingActivities) : null,
      number_of_shares_issued_at_the_end_of_the_term:
        statement.NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      number_of_treasury_stock_at_the_end_of_fiscal_year:
        statement.NumberOfTreasuryStockAtTheEndOfFiscalYear !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      average_number_of_shares:
        statement.AverageNumberOfShares !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      non_consolidated_net_sales:
        statement.NonConsolidatedNetSales !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      non_consolidated_operating_profit:
        statement.NonConsolidatedOperatingProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      non_consolidated_ordinary_profit:
        statement.NonConsolidatedOrdinaryProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      non_consolidated_profit:
        statement.NonConsolidatedProfit !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      non_consolidated_earnings_per_share:
        statement.NonConsolidatedEarningsPerShare !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      non_consolidated_total_assets:
        statement.NonConsolidatedTotalAssets !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      non_consolidated_equity:
        statement.NonConsolidatedEquity !== undefined ? Number(statement.CashFlowsFromOperatingActivities) : null,
      non_consolidated_equity_to_asset_ratio:
        statement.NonConsolidatedEquityToAssetRatio !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      non_consolidated_book_value_per_share:
        statement.NonConsolidatedBookValuePerShare !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_net_sales_2nd_q:
        statement.ForecastNonConsolidatedNetSales2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_operating_profit_2nd_q:
        statement.ForecastNonConsolidatedOperatingProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_ordinary_profit_2nd_q:
        statement.ForecastNonConsolidatedOrdinaryProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_profit_2nd_q:
        statement.ForecastNonConsolidatedProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_earnings_per_share_2nd_q:
        statement.ForecastNonConsolidatedEarningsPerShare2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_net_sales_2nd_q:
        statement.NextYearForecastNonConsolidatedNetSales2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_operating_profit_2nd_q:
        statement.NextYearForecastNonConsolidatedOperatingProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_ordinary_profit_2nd_q:
        statement.NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_profit_2nd_q:
        statement.NextYearForecastNonConsolidatedProfit2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_earnings_per_share_2nd_q:
        statement.NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_net_sales:
        statement.ForecastNonConsolidatedNetSales !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_operating_profit:
        statement.ForecastNonConsolidatedOperatingProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_ordinary_profit:
        statement.ForecastNonConsolidatedOrdinaryProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_profit:
        statement.ForecastNonConsolidatedProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      forecast_non_consolidated_earnings_per_share:
        statement.ForecastNonConsolidatedEarningsPerShare !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_net_sales:
        statement.NextYearForecastNonConsolidatedNetSales !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_operating_profit:
        statement.NextYearForecastNonConsolidatedOperatingProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_ordinary_profit:
        statement.NextYearForecastNonConsolidatedOrdinaryProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_profit:
        statement.NextYearForecastNonConsolidatedProfit !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
      next_year_forecast_non_consolidated_earnings_per_share:
        statement.NextYearForecastNonConsolidatedEarningsPerShare !== undefined
          ? Number(statement.CashFlowsFromOperatingActivities)
          : null,
    };
  });

  await db.statements.createMany({ data: statements });

  return response.status(200).json(financialStatements);
}
