// @mui
import { Avatar, Button, ButtonProps, Typography } from '@mui/material';

// components
import Iconify from '@/components/template/iconify';
import { Trans } from '@/providers/LanguageProvider/Trans';
import { SelectTokenDialog } from './SelectTokenDialog';

// ----------------------------------------------------------------------

interface Props extends ButtonProps {
  selectedToken: string;
  selectedAmount: string;
  maxAmount: string;
  selectedTokenBalance: string;
  tokens: any[];
}

export const SelectTokenButton = ({
  selectedToken,
  selectedAmount,
  maxAmount,
  selectedTokenBalance,
  tokens,
  ...other
}: Props) => {
  const showTokens = useBoolean();

  const insufficientBalance = selectedAmount > selectedTokenBalance;
  const maxSelected = selectedAmount === maxAmount;

  if (!selectedToken)
    return (
      <Button
        color="info"
        variant="contained"
        endIcon={<Iconify icon="solar:alt-arrow-down-linear" />}
        onClick={showTokens.onTrue}
        {...other}
      >
        <Trans>Select token</Trans>
      </Button>
    );

  return (
    <>
      <Button
        color="info"
        variant="contained"
        endIcon={<Iconify icon="solar:alt-arrow-down-linear" />}
        onClick={showTokens.onTrue}
        {...other}
      >
        <Avatar
          src={`/assets/icons/exchanges/${selectedToken}.svg`}
          alt={selectedToken}
          sx={{ width: 24, height: 24, mr: 1 }}
        />
        <Trans>{selectedToken}</Trans>
      </Button>

      <Typography variant="caption2" color={insufficientBalance ? 'error' : 'inherit'}>
        {selectedTokenBalance} {selectedToken}
        <Button
          color={maxSelected ? 'inherit' : 'info'}
          variant="contained"
          size="small"
          onClick={showTokens.onTrue}
          disabled={maxSelected}
        >
          <Trans>Max</Trans>
        </Button>
      </Typography>

      <SelectTokenDialog
        open={showTokens.value}
        tokens={tokens}
        userTokens={[]}
        onClose={showTokens.onFalse}
      />
    </>
  );
};
