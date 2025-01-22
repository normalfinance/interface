import { Button, Card, Skeleton, Typography } from '@mui/material';
import { fCurrency } from '@/utils/format-number';
import { Trans } from '@/i18n';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

type Props = {
  onNext: () => void;
};

export default function CreateLiquidityPositionStepThree({ onNext }: Props) {
  return (
    <Card>
      <Typography variant="h6">
        <Trans>Deposit tokens</Trans>
      </Typography>
      <Typography variant="caption2">
        <Trans>Specify the token amounts for your liquidity contribution.</Trans>
      </Typography>

      {/* TODO: token a form */}
      {/* TODO: token b form */}

      <LoadingButton onClick={onNext}>
        {x && <Trans>Enter an amount</Trans>}
        {x && <Trans>Insufficient balance</Trans>}
        {x && <Trans>Deposit</Trans>}
      </LoadingButton>
    </Card>
  );
}
