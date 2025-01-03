// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fCurrency } from 'src/utils/format-number';
//
import Scrollbar from 'src/components/scrollbar';
import { Trans } from '@/i18n';
import Label from './label';
import { RouterLink } from '@/routes/components';
import { paths } from '@/routes/paths';
import { Button } from '@mui/material';
import Iconify from './iconify';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  pools: AMM[];
}

export default function TopPoolsByTVL({ pools, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={<Trans>Top pools by TVL</Trans>} />

      <Stack spacing={3} sx={{ p: 3, minWidth: 360 }}>
        {pools.map((pool) => (
          <LiquidityPoolItem key={pool.id} pool={pool} />
        ))}
      </Stack>

      <Button
        variant="outlined"
        color="inherit"
        endIcon={<Iconify icon="mingcute:add-line" />}
        component={RouterLink}
        href={paths.markets}
      >
        <Trans>Explore more markets</Trans>
      </Button>
    </Card>
  );
}

// ----------------------------------------------------------------------

type LiquidityPoolItemProps = {
  pool: AMM;
};

function LiquidityPoolItem({ pool }: LiquidityPoolItemProps) {
  const { name, fee } = pool;

  return (
    <Stack direction="row" spacing={2} component={RouterLink} href={paths.marketById(pool.id)}>
      <Avatar
        variant="rounded"
        alt={name}
        // src={coverUrl}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <ListItemText
        primary={<Link sx={{ color: 'text.primary', typography: 'subtitle2' }}>{name}</Link>}
        secondary={
          <Box component="span" sx={{ color: priceSale ? 'error.main' : 'text.secondary' }}>
            <Label variant="soft" color="info">
              v1
            </Label>

            <Label variant="soft" color="error">
              {fee}
              {/* 0.30% */}
            </Label>
          </Box>
        }
        primaryTypographyProps={{
          noWrap: true,
        }}
        secondaryTypographyProps={{
          mt: 0.5,
        }}
      />
    </Stack>
  );
}
