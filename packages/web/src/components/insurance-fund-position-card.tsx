import { Card, CardHeader, Stack, Typography } from '@mui/material';
import { Trans } from '@/i18n';
import TVL from './tvl';
import LoadingButtonModal from './loading-button-modal';
import { fPercent } from '@/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  balance: string;
  currentYield: string;
};

export default function InsurnaceFundPositionCard({ balance, currentYield }: Props) {
  return (
    <Card sx={{ p: 3, textAlign: 'center', typography: 'h4' }}>
      <CardHeader
        sx={{ pb: 3 }}
        title={
          <Trans>Now that you&apos;re all setup, here&apos;s all you can do with Normal 🚀</Trans>
        }
      />

      {/* Balance */}
      <TVL amount={balance} color="info" />

      {/* Yield */}
      <Typography variant="caption2">Yield: {fPercent(currentYield)}</Typography>

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <LoadingButtonModal buttonText="Deposit" />

        <LoadingButtonModal buttonText="Withdraw" />
      </Stack>
    </Card>
  );
}
