'use client';

import { useState, useCallback } from 'react';
// @mui
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { Index } from '@normalfinance/types';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import EmptyContent from 'src/components/empty-content';
import { useTable, getComparator } from 'src/components/table';
//
import {
  CommunityIndexFilters,
  CommunityIndexFiltersResult,
  CommunityIndexTable,
} from './community-index-table';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  type: [],
};

interface Props extends StackProps {
  indexes: Index[];
}

// ----------------------------------------------------------------------

export default function CommunityIndexes({ indexes }: Props) {
  const table = useTable({ defaultRowsPerPage: 10 });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(indexes);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset = !!filters.name || !!filters.type.length;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IFileFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <CommunityIndexFilters
        filters={filters}
        onFilters={handleFilters}
        //
        typeOptions={FILE_TYPE_OPTIONS}
      />
    </Stack>
  );

  const renderResults = (
    <CommunityIndexFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <>
      <Stack
        spacing={2.5}
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound ? (
        <EmptyContent
          filled
          title="No Data"
          sx={{
            py: 10,
          }}
        />
      ) : (
        <>
          <CommunityIndexTable
            table={table}
            tableData={tableData}
            dataFiltered={dataFiltered}
            notFound={notFound}
            onOpenConfirm={confirm.onTrue}
          />
        </>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IFile[];
  comparator: (a: any, b: any) => number;
  filters: IFileFilters;
}) {
  const { name, type } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  return inputData;
}
