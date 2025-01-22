// ----------------------------------------------------------------------

import { RHFTextField } from '@/components/template/hook-form';
import { Button, Card, Grid, Stack, Typography } from '@mui/material';

interface Props {
  title: React.ReactNode;
  index: any; //Index;
}

const SendTab = ({ title, index, ...other }: Props) => {
  const mdUp = useResponsive('up', 'md');

  const confirm = useBoolean();

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your sending
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Amount</Typography>
              <RHFTextField name="amount" placeholder="0" />
            </Stack>

            <Stack spacing={1.5}>{/* asset select */}</Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">To</Typography>
              <RHFTextField name="to" placeholder="Wallet address or ENS name" />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentJob ? <Trans>Input amount</Trans> : <Trans>Send</Trans>}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderActions}
        </Grid>
      </FormProvider>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Review send"
        content={`You're sending ${fCurrency(values.amount)} to ${values.to}`}
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Confirm send
          </Button>
        }
      />
    </>
  );
};

export { SendTab };
