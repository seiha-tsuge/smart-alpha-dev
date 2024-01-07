import React from 'react';

import { DateHeader, DataTable } from '@/objects/financial-results/components/list';

import { api } from '@/utils/api';

export const FinancialResults = () => {
  const { data } = api.post.getSecretMessage.useQuery();
  return (
    <>
      <DateHeader />
      <DataTable />
    </>
  );
};
