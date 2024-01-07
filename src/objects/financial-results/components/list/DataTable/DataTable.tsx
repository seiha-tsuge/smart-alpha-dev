import React from 'react';

import { DataTable as MantineDataTable } from 'mantine-datatable';

import type { FinancialStatement } from '@/server/infra/api/jquants/interfaces';

interface DataTableProps {
  data?: FinancialStatement[];
}

export const DataTable = ({ data }: DataTableProps) => {
  return (
    <MantineDataTable
      highlightOnHover
      records={data}
      columns={[
        {
          accessor: 'LocalCode',
          title: '銘柄コード',
        },
        {
          accessor: 'DisclosedDate',
          title: '銘開示日',
        },
        {
          accessor: 'DisclosedTime',
          title: '開示時刻',
        },
        {
          accessor: 'NetSales',
          title: '売上高',
        },
      ]}
    />
  );
};
