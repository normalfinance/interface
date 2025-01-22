import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from '@/components/template/iconify';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Trans } from '@/i18n';
import { SanitizedExchange } from '@normalfinance/utils';
import { ITokenTableFilterValue, ITokenTableFilters } from './insurance-fund-transactions-table';

// ----------------------------------------------------------------------

type Props = {
  filters: ITokenTableFilters;
  onFilters: (search: string, value: ITokenTableFilterValue) => void;
  exchanges: SanitizedExchange[];
};

export default function TokenTableToolbar({ filters, onFilters, exchanges }: Props) {
  const handleFilterExchange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'exchangeId',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('search', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>
          <Trans>Exchange</Trans>
        </InputLabel>

        <Select
          multiple
          value={filters.exchangeId}
          onChange={handleFilterExchange}
          input={<OutlinedInput label="Exchange" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {exchanges.map((exchange) => (
            <MenuItem key={exchange.id} value={exchange.id.toString()}>
              <Checkbox
                disableRipple
                size="small"
                checked={filters.exchangeId.includes(exchange.id.toString())}
              />
              {`${exchange.type} (${exchange.nickname})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        sx={{ pr: 1 }}
        fullWidth
        value={filters.search}
        onChange={handleFilterSearch}
        placeholder="Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
