'use client';

import { useState, useCallback } from 'react';

import isEqual from 'lodash/isEqual';

// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

// types
// hooks

// components
import Scrollbar from '@/components/scrollbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '@/components/table';
//
// analytics
import { Trans } from '@/i18n';
import { Card } from '@mui/material';
import TokenTableToolbar from './token-table-toolbar';
import InsuranceFundTransactionTableRow from './insurance-fund-transaction-table-row';

// ----------------------------------------------------------------------

export type ITokenTableFilterValue = string | string[];

export type ITokenTableFilters = {
  exchangeId: string[];
  search: string;
};

const defaultFilters: ITokenTableFilters = {
  exchangeId: [],
  search: '',
};

// ----------------------------------------------------------------------

type Props = {
  transactions: any[];
};

export default function InsuranceFundTransactionsTable({ transactions }: Props) {
  const table = useTable({
    defaultRowsPerPage: 100,
    defaultOrderBy: 'value',
    defaultOrder: 'desc',
    defaultDense: true,
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: transactions,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: ITokenTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  return (
    <Card>
      <TokenTableToolbar filters={filters} onFilters={handleFilters} exchanges={exchanges} />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={[
                { id: 'name', label: <Trans>Name</Trans> },
                { id: 'price', label: <Trans>Price</Trans> },
                { id: 'value', label: <Trans>Balance</Trans> },
                { id: 'allocation', label: <Trans>Allocation</Trans> },
                { id: 'oneHourChange', label: '1h %' },
                { id: 'oneDayChange', label: '24h %' },
                { id: 'oneWeekChange', label: '7d %' },
                { id: 'marketCap', label: <Trans>Market Cap</Trans> },
              ]}
              rowCount={tableData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {!canReset &&
                dataFiltered.map((row) => <InsuranceFundTransactionTableRow row={row} />)}

              <TableEmptyRows
                height={72}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        rowsPerPageOptions={[50, 100, 250]}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: TTokenTableRow[];
  comparator: (a: any, b: any) => number;
  filters: ITokenTableFilters;
}) {
  const { exchangeId, search } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // An exchange filter is selected, only show those balances
  if (exchangeId.length) {
    inputData = inputData.filter((row) => exchangeId.includes(row.exchangeId));
  }

  if (search) {
    inputData = inputData.filter(
      (row) => row.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  }

  return inputData;
}
