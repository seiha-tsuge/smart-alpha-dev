export interface ErrorResponse {
  message: string;
}

export interface GetRefreshTokenData {
  refreshToken: string;
}

export interface GetRefreshTokenResponse {
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export interface GetIdTokenData {
  idToken: string;
}

export interface GetIdTokenResponse {
  idToken: string;
  idTokenExpiresAt: Date;
}

export interface GetFinancialStatementsRequest {
  idToken: string;
  code?: string;
  date?: string;
  pagination_key?: string;
}

export type FinancialStatement = {
  DisclosedDate: string;
  DisclosedTime: string;
  LocalCode: string;
  DisclosureNumber: string;
  TypeOfDocument: string;
  TypeOfCurrentPeriod: string;
  CurrentPeriodStartDate: string;
  CurrentPeriodEndDate: string;
  CurrentFiscalYearStartDate: string;
  CurrentFiscalYearEndDate: string;
  NextFiscalYearStartDate: string;
  NextFiscalYearEndDate: string;
  NetSales: string;
  OperatingProfit: string;
  OrdinaryProfit: string;
  Profit: string;
  EarningsPerShare: string;
  DilutedEarningsPerShare: string;
  TotalAssets: string;
  Equity: string;
  EquityToAssetRatio: string;
  BookValuePerShare: string;
  CashFlowsFromOperatingActivities: string;
  CashFlowsFromInvestingActivities: string;
  CashFlowsFromFinancingActivities: string;
  CashAndEquivalents: string;
  ResultDividendPerShare1stQuarter: string;
  ResultDividendPerShare2ndQuarter: string;
  ResultDividendPerShare3rdQuarter: string;
  ResultDividendPerShareFiscalYearEnd: string;
  ResultDividendPerShareAnnual: string;
  DistributionsPerUnit: string;
  ResultTotalDividendPaidAnnual: string;
  ResultPayoutRatioAnnual: string;
  ForecastDividendPerShare1stQuarter: string;
  ForecastDividendPerShare2ndQuarter: string;
  ForecastDividendPerShare3rdQuarter: string;
  ForecastDividendPerShareFiscalYearEnd: string;
  ForecastDividendPerShareAnnual: string;
  ForecastDistributionsPerUnit: string;
  ForecastTotalDividendPaidAnnual: string;
  ForecastPayoutRatioAnnual: string;
  NextYearForecastDividendPerShare1stQuarter: string;
  NextYearForecastDividendPerShare2ndQuarter: string;
  NextYearForecastDividendPerShare3rdQuarter: string;
  NextYearForecastDividendPerShareFiscalYearEnd: string;
  NextYearForecastDividendPerShareAnnual: string;
  NextYearForecastDistributionsPerUnit: string;
  NextYearForecastPayoutRatioAnnual: string;
  ForecastNetSales2ndQuarter: string;
  ForecastOperatingProfit2ndQuarter: string;
  ForecastOrdinaryProfit2ndQuarter: string;
  ForecastProfit2ndQuarter: string;
  ForecastEarningsPerShare2ndQuarter: string;
  NextYearForecastNetSales2ndQuarter: string;
  NextYearForecastOperatingProfit2ndQuarter: string;
  NextYearForecastOrdinaryProfit2ndQuarter: string;
  NextYearForecastProfit2ndQuarter: string;
  NextYearForecastEarningsPerShare2ndQuarter: string;
  ForecastNetSales: string;
  ForecastOperatingProfit: string;
  ForecastOrdinaryProfit: string;
  ForecastProfit: string;
  ForecastEarningsPerShare: string;
  NextYearForecastNetSales: string;
  NextYearForecastOperatingProfit: string;
  NextYearForecastOrdinaryProfit: string;
  NextYearForecastProfit: string;
  NextYearForecastEarningsPerShare: string;
  MaterialChangesInSubsidiaries: string;
  ChangesBasedOnRevisionsOfAccountingStandard: string;
  ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard: string;
  ChangesInAccountingEstimates: string;
  RetrospectiveRestatement: string;
  NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock: string;
  NumberOfTreasuryStockAtTheEndOfFiscalYear: string;
  AverageNumberOfShares: string;
  NonConsolidatedNetSales: string;
  NonConsolidatedOperatingProfit: string;
  NonConsolidatedOrdinaryProfit: string;
  NonConsolidatedProfit: string;
  NonConsolidatedEarningsPerShare: string;
  NonConsolidatedTotalAssets: string;
  NonConsolidatedEquity: string;
  NonConsolidatedEquityToAssetRatio: string;
  NonConsolidatedBookValuePerShare: string;
  ForecastNonConsolidatedNetSales2ndQuarter: string;
  ForecastNonConsolidatedOperatingProfit2ndQuarter: string;
  ForecastNonConsolidatedOrdinaryProfit2ndQuarter: string;
  ForecastNonConsolidatedProfit2ndQuarter: string;
  ForecastNonConsolidatedEarningsPerShare2ndQuarter: string;
  NextYearForecastNonConsolidatedNetSales2ndQuarter: string;
  NextYearForecastNonConsolidatedOperatingProfit2ndQuarter: string;
  NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter: string;
  NextYearForecastNonConsolidatedProfit2ndQuarter: string;
  NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter: string;
  ForecastNonConsolidatedNetSales: string;
  ForecastNonConsolidatedOperatingProfit: string;
  ForecastNonConsolidatedOrdinaryProfit: string;
  ForecastNonConsolidatedProfit: string;
  ForecastNonConsolidatedEarningsPerShare: string;
  NextYearForecastNonConsolidatedNetSales: string;
  NextYearForecastNonConsolidatedOperatingProfit: string;
  NextYearForecastNonConsolidatedOrdinaryProfit: string;
  NextYearForecastNonConsolidatedProfit: string;
  NextYearForecastNonConsolidatedEarningsPerShare: string;
};

export type GetFinancialStatementsResponse = {
  statements: FinancialStatement[];
  pagination_key: string;
};

export interface GetListedInfoRequest {
  idToken: string;
  code?: string;
  date?: string;
}

export interface ListedInfo {
  Date: string;
  Code: string;
  CompanyName: string;
  CompanyNameEnglish: string;
  Sector17Code: string;
  Sector17CodeName: string;
  Sector33Code: string;
  Sector33CodeName: string;
  ScaleCategory: string;
  MarketCode: string;
  MarketCodeName: string;
  MarginCode: string;
  MarginCodeName: string;
}

export interface GetListedInfoResponse {
  info: ListedInfo[];
}

export interface IJQuantsApi {
  getRefreshToken(): Promise<GetRefreshTokenResponse>;
  getIdToken(refreshToken: string): Promise<GetIdTokenResponse>;
  getFinancialStatements({
    idToken,
    code,
    date,
    pagination_key,
  }: GetFinancialStatementsRequest): Promise<GetFinancialStatementsResponse>;
  getListedInfo({ idToken, code, date }: GetListedInfoRequest): Promise<GetListedInfoResponse>;
}
