import React from 'react';

import { DataTable as MantineDataTable } from 'mantine-datatable';

export const DataTable = () => {
  return (
    <MantineDataTable
      highlightOnHover
      records={[
        { id: 1, name: 'Joe Biden', bornIn: 1942 },
        { id: 2, name: 'Joe Biden', bornIn: 1942 },
      ]}
      columns={[
        {
          accessor: 'id',
          title: '#',
        },
        { accessor: 'name' },
        { accessor: 'bornIn' },
      ]}
    />
  );
};
