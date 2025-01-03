// @mui
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fCurrency, fPercent } from 'src/utils/format-number';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { Trans } from '@/i18n';
import AssetAvatarGroup from './asset-avatar-group';
import { IconButton, Tooltip } from '@mui/material';
import { useBoolean } from '@/hooks/use-boolean';

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  name: string;
  flag: string;
  rank: string;
  email: string;
  category: string;
  avatarUrl: string;
  totalAmount: number;
};

interface Props extends CardProps {
  indexes: RowProps[];
}

export default function NormalIndexes({ indexes, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={<Trans>Normal Indexes</Trans>}
        subheader={<Trans>idk</Trans>}
        sx={{ mb: 3 }}
      />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 640 }}>
            <TableHeadCustom
              headLabel={[
                { id: 'name', label: 'Seller' },
                { id: 'category', label: 'Product' },
                { id: 'country', label: 'Country', align: 'center' },
                { id: 'totalAmount', label: 'Total', align: 'right' },
                { id: 'rank', label: 'Rank', align: 'right' },
              ]}
            />

            <TableBody>
              {indexes.map((index) => (
                <NormalIndexRow key={index.id} index={index} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

type NormalIndexRowProps = {
  index: RowProps;
};

function NormalIndexRow({ index }: NormalIndexRowProps) {
  const swap = useBoolean();

  const weeklyPerformance = '0'; // TODO:

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={index.title} src={index.icon} sx={{ mr: 2 }} />
          {index.title}
        </TableCell>

        {/* Top 5 assets */}
        <AssetAvatarGroup
          assets={orderedWeights.slice(0, 4).map((w) => w.asset)}
          size={24}
          max={3}
          fontSize={12}
        />

        {/* Performance */}
        <TableCell align="right">{fPercent(weeklyPerformance)}</TableCell>

        {/* TVL */}
        <TableCell>{fCurrency(index.tvl)}</TableCell>

        {/* Buy/Sell */}
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Buy" placement="top" arrow>
            <IconButton color="success" onClick={swap.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sell" placement="top" arrow>
            <IconButton color="error" onClick={swap.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <IndexSwapForm index={index} open={swap.value} onClose={swap.onFalse} />
    </>
  );
}
