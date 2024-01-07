import React from 'react';

import { DateHeader, DataTable } from '@/objects/financial-results/components/list';
import { api } from '@/utils/api';

export const FinancialResults = () => {
  const { data } = api.finsStatements.getFinsStatements.useQuery({
    date: '2021-10-15',
  });

  return (
    <>
      <DateHeader />
      <DataTable data={data?.statements} />
    </>
  );
};
