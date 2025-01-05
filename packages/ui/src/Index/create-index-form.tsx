import { useCallback } from 'react';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trans } from '@/i18n';
import {
  Box,
  Divider,
  FormHelperText,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import FormProvider, { RHFCheckbox, RHFNumber, RHFTextField } from '../components/hook-form';

// hooks
import { useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContractTransaction } from '@/hooks/use-contract-transaction';

// ----------------------------------------------------------------------

export default function CreateIndexForm() {
  const { executeContractTransaction } = useContractTransaction();

  const form = useForm<z.infer<typeof createIndexSchema>>({
    resolver: zodResolver(createIndexSchema),
    defaultValues: {
      name: '',
      symbol: '',
      privacy: true,
      weights: {},
    },
  });

  const onSubmit = (data: z.infer<typeof createIndexSchema>) => {
    doCreateIndex();
  };

  const {
    watch,
    setValue,
    formState: { isSubmitting, errors, isValid },
  } = form;

  const values = watch();

  /**
   * Executes the swap transaction.
   * This function signs and sends the transaction using WalletConnect or Signer.
   *
   * @async
   */
  const doCreateIndex = useCallback(async (): Promise<void> => {
    try {
      // Execute the transaction using the hook
      await executeContractTransaction({
        contractType: 'multihop',
        contractAddress: constants.MULTIHOP_ADDRESS,
        transactionFunction: async (client, restore) => {
          return client.swap(
            {
              recipient: storePersist.wallet.address!,
              operations,
              amount: BigInt(tokenAmounts[0] * 10 ** 7),
              max_spread_bps: BigInt(maxSpread * 100),
              deadline: undefined,
              pool_type: 0,
              max_allowed_fee_bps: undefined,
            },
            { simulate: !restore }
          );
        },
      });

      // Wait for the next block and fetch token balances
      setTimeout(async () => {
        await appStore.fetchTokenInfo(fromToken?.name!);
        await appStore.fetchTokenInfo(toToken?.name!);
      }, 7000);
    } catch (error) {
      console.log('Error during swap transaction', error);
    }
  }, [
    appStore,
    fromToken?.name,
    maxSpread,
    operations,
    storePersist,
    toToken?.name,
    tokenAmounts,
    executeContractTransaction,
  ]);

  return (
    <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={3}
      >
        {/* Meta info */}
        <Stack width={1}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField
              name="name"
              label={<Trans>Name</Trans>}
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{values.name.length}/25</InputAdornment>
                ),
              }}
            />
            {errors.name && <div className="error">{errors.name.message}</div>}

            <RHFTextField
              name="symbol"
              label={<Trans>Synmbol</Trans>}
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{values.symbol.length}/5</InputAdornment>
                ),
              }}
            />
            {errors.symbol && <div className="error">{errors.symbol.message}</div>}

            <RHFCheckbox
              name="privacy"
              label="Privacy"
              helperText={
                <Typography variant="caption">
                  {values.privacy === false ? (
                    <Trans>Faster execution, higher exchange fee, any price</Trans>
                  ) : (
                    <Trans>
                      Slower execution, lower exchange fee, price must be above bid or below ask
                    </Trans>
                  )}
                </Typography>
              }
            />

            <RHFNumber
              name="manager_fee"
              label={<Trans>Fee</Trans>}
              placeholder="0.00"
              returnAsString
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      {values.currency}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            {!!errors.manager_fee && (
              <FormHelperText error> {errors.manager_fee?.message}</FormHelperText>
            )}

            <RHFNumber
              name="revenue_share"
              label={<Trans>Revenue Share</Trans>}
              placeholder="0.00"
              returnAsString
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      {values.revenue_share}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            {!!errors.revenue_share && (
              <FormHelperText error> {errors.revenue_share?.message}</FormHelperText>
            )}
          </Box>
        </Stack>

        {/* Asset info */}
        <Stack width={1}></Stack>
      </Stack>

      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          <Trans>Create</Trans>
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

const createIndexSchema = z.object({
  name: z
    .string({
      required_error: 'Please enter a name',
    })
    .min(1),
  symbol: z
    .string({
      required_error: 'Please enter a symbol',
    })
    .min(1),
  privacy: z.boolean(),
  manager_fee: z.number(),
  revenue_share: z.number().optional(),
  whitelist: z.string().array(),
  blacklist: z.string().array(),
  weights: z.record(z.string().min(1), z.string().min(1)),
});
