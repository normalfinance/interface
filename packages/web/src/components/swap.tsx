import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// types
// components
import Iconify from 'src/components/iconify';
import { TokenDialog } from './custom-dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import { Trans } from '@/i18n';
import { useSwap } from '@/hooks/use-swap';

// ----------------------------------------------------------------------

type Props = {
  userTokens: any[];
};

export default function Swap({ userTokens }: Props) {
  const { tokenA, tokenB, onSwap } = useSwap();

  const renderTokenA = (
    <>
      <CardHeader
        title="Sell"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer.name}
          src={customer.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{amount}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{usdValue}</Box>
        </Stack>
      </Stack>
    </>
  );

  return (
    <>
      <Card>
        {renderTokenA}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <IconButton color="success" onClick={handleSwapTokens}>
          <Iconify icon="solar:pen-bold" />
        </IconButton>

        {renderTokenB}

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            <Trans>Swap</Trans>
          </LoadingButton>
        </Stack>
      </Card>

      <TokenDialog key="tokenA" open={selectTokenA.value} onClose={selectTokenA.onFalse} />
      <TokenDialog key="tokenB" open={selectTokenB.value} onClose={selectTokenB.onFalse} />
    </>
  );
}
