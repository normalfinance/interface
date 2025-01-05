import { Button, Card, Skeleton, Typography } from '@mui/material';
import { fCurrency } from '@/utils/format-number';
import { Trans } from '@/i18n';

// ----------------------------------------------------------------------

type Props = {
  onNext: () => void;
};

export default function CreateLiquidityPositionStepOne({ onNext }: Props) {
  return (
    <Card>
      <Typography variant="h6">
        <Trans>Select a pair</Trans>
      </Typography>
      <Typography variant="caption2">
        <Trans>
          Choose the tokens you want to provide liquidity for. You can select tokens on all
          supported networks.
        </Trans>
      </Typography>

      {/* .. */}

      <Typography variant="h6">
        <Trans>Fee tier</Trans>
      </Typography>
      <Typography variant="caption2">
        <Trans>
          The amount earned providing liquidity. Choose an amount that suits your risk tolerance and
          strategy.
        </Trans>
      </Typography>

      <Button onClick={onNext}>Continue</Button>
    </Card>
  );
}
