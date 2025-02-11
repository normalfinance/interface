'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { IUserTableFilters } from 'src/types/user';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { Label, LabelColor } from 'src/components/label';
import { UserTableRow } from './_components/user-table-row';
import { UserTableToolbar } from './_components/user-table-toolbar';
import { UserTableFiltersResult } from './_components/user-table-filters-result';

// ----------------------------------------------------------------------

//const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'percentageChange', label: 'Change (%)' },
  { id: 'performance', label: 'Performance' },
  { id: 'status' },
  { id: '', width: 88 },
];

// ─── Define a type for Market ─────────────────────────────────────────────
export interface Market {
  id: string;
  name: string;
  price: number;
  percentageChange: number;
  performance: string;
  status: string;
  avatarUrl: string;
  url: string;
}

// ─── Define status options (adjust as needed) ─────────────────────────────
const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'trending', label: 'Trending' },
  { value: 'new', label: 'New' },
  { value: 'meme', label: 'Meme' },
  { value: 'rwa', label: 'RWA' },
];

// Mapping between status values and colors
const statusColorMapping: Record<string, LabelColor> = {
  trending: 'info',
  new: 'primary',
  meme: 'warning',
  rwa: 'error',
  all: 'default',
};

export type MarketTableProps = {
  markets: Market[];
};

// ----------------------------------------------------------------------

export function MarketTable({ markets }: MarketTableProps) {
  const table = useTable();

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<Market[]>(markets);

  const filters = useSetState<IUserTableFilters>({ name: '', role: [], status: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!currentFilters.name || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success('Delete success!');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    toast.success('Delete success!');
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong>{table.selected.length}</strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <Card>
        <Tabs
          value={currentFilters.status}
          onChange={handleFilterStatus}
          sx={[
            (theme) => ({
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                    'soft'
                  }
                  color={
                    (tab.value === 'trending' && 'info') ||
                    (tab.value === 'new' && 'primary') ||
                    (tab.value === 'meme' && 'warning') ||
                    (tab.value === 'rwa' && 'error') ||
                    'default'
                  }
                >
                  {['trending', 'new', 'meme', 'rwa'].includes(tab.value)
                    ? tableData.filter((market) => market.status === tab.value).length
                    : tableData.length}
                </Label>
              }
            />
          ))}
        </Tabs>

        {/************ SEARCHBAR IN THERE *************/}
        <UserTableToolbar filters={filters} onResetPage={table.onResetPage} />

        {canReset && (
          <UserTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              {/**************** TABLE HEAD HERE *******************/}
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      // `editHref` removed or replaced with custom link
                      editHref="#"
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: Market[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status } = filters; // ignore `role` since it's not used for markets

  // Sort the data
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);

  // Filter by name
  if (name) {
    inputData = inputData.filter((market) =>
      market.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by status (if not "all")
  if (status !== 'all') {
    inputData = inputData.filter((market) => market.status === status);
  }

  return inputData;
}
