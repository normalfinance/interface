// @mui
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// components
import { fCurrency, fMarketCap, fPercent } from '@/utils/format-number';
import Label from '@/components/label';
import Decimal from 'decimal.js';
// Types
import { TTokenTableRow } from '@/types/token';
import { RouterLink } from '@/routes/components';
import { paths } from '@/routes/paths';
// import { IconButton } from '@mui/material';
// import Iconify from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  row: TTokenTableRow;
};

export default function InsuranceFundTransactionTableRow({ row }: Props) {
  const {
    name,
    price,
    balance,
    // currency,
    value,
    allocation,
    oneHourChange,
    oneDayChange,
    oneWeekChange,
    marketCap,
  } = row;

  return (
    <TableRow
      hover
      component={RouterLink}
      href={paths.tokenBySymbol(name)}
      sx={{ textDecoration: 'none' }}
    >
      {/* Name */}
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={`/assets/icons/cryptoLogos/${name}.svg`} sx={{ mr: 2 }} />

        <ListItemText
          primary={name}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>

      {/* Price */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fCurrency(price.toString())}</TableCell>

      {/* Amount */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={`${fCurrency(value.toString())} USD`}
          secondary={balance.toString()}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>

      {/* Allocation */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fPercent(allocation) || '0%'}</TableCell>

      {/* 1h % */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label color={new Decimal(oneHourChange).greaterThan(0) ? 'success' : 'error'}>
          {new Decimal(oneHourChange).greaterThan(0) && '+'}

          {fPercent(oneHourChange.toString()) || '0%'}
        </Label>
      </TableCell>

      {/* 24h % */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label color={new Decimal(oneDayChange).greaterThan(0) ? 'success' : 'error'}>
          {new Decimal(oneDayChange).greaterThan(0) && '+'}

          {fPercent(oneDayChange.toString()) || '0%'}
        </Label>
      </TableCell>

      {/* 7d % */}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Label color={new Decimal(oneWeekChange).greaterThan(0) ? 'success' : 'error'}>
          {new Decimal(oneWeekChange).greaterThan(0) && '+'}

          {fPercent(oneWeekChange.toString()) || '0%'}
        </Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fMarketCap(marketCap)}</TableCell>
    </TableRow>
  );
}
