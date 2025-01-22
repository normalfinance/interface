// @mui
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
// types
import { Index } from '@normalfinance/types';
// utils
import { fCurrency, fPercent } from '@normalfinance/utils';
// components
import Iconify from '@/components/template/iconify';
import Scrollbar from '@/components/template/scrollbar';
import { TableHeadCustom } from '@/components/template/table';
import AssetAvatarGroup from '../template/asset-avatar-group';
import { IconButton, Tooltip } from '@mui/material';
import { useBoolean } from '@/hooks';
import { Trans } from '@/providers/LanguageProvider/Trans';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  indexes: Index[];
}

export default function NormalIndexes({ indexes, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={<Trans>Normal Indexes</Trans>}
        subheader={<Trans>Funds created and managd by Normal</Trans>}
        sx={{ mb: 3 }}
      />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 640 }}>
            <TableHeadCustom
              headLabel={[
                { id: 'name', label: 'Name' },
                { id: 'topAssets', label: 'Top 5 Assets' },
                { id: 'performance', label: 'Performance' },
                { id: 'popularity', label: 'Popularity' },
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
  index: Index;
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
          assets={index.assets.slice(0, 4).map((w) => w.asset)}
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

      {/* <IndexSwapForm index={index} open={swap.value} onClose={swap.onFalse} /> */}
    </>
  );
}
