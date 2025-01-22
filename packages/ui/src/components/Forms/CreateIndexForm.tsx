import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import FormProvider, {
  RHFCheckbox,
  RHFNumber,
  RHFSelect,
  RHFTextField,
} from '@/components/template/hook-form';

// hooks
import { useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';

import { Trans } from '@/providers/LanguageProvider/Trans';
import { IndexWeightsPieChart } from '@/components/Charts';
import Iconify from '@/components/template/iconify';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  error: string | null;
  loading: boolean;
  onCreate: (data: z.infer<typeof createIndexSchema>) => void;
};

export const CreateIndexForm = ({ error, loading, onCreate }: Props) => {
  const [assetFields, setAssetFields] = useState(1);

  const form = useForm<z.infer<typeof createIndexSchema>>({
    resolver: zodResolver(createIndexSchema),
    defaultValues: {
      name: '',
      symbol: '',
      privacy: true,
      assets: [],
      weights: [],
    },
  });

  const onSubmit = (data: z.infer<typeof createIndexSchema>) => {
    onCreate(data);
  };

  const {
    watch,
    formState: { isSubmitting, errors, isValid },
  } = form;

  const values = watch();

  const renderAssets = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              {values.assets.map((_, index) => {
                return (
                  <>
                    <RHFTextField
                      name={`assets[${index}]`}
                      label="Asset"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />

                    <RHFTextField
                      name={`weights[${index}]`}
                      label="Weight"
                      placeholder="0"
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      disabled
                    />

                    <IconButton onClick={() => setAssetFields(assetFields - 1)}>
                      <Iconify icon="solar:trash-bold" />
                    </IconButton>
                  </>
                );
              })}

              <RHFTextField
                name="weights[0]"
                label="Weight"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect native name="assets" label="Asset" InputLabelProps={{ shrink: true }}>
                <p>TODO:</p>
              </RHFSelect>

              <Button
                color="inherit"
                variant="contained"
                startIcon={<Iconify icon="solar:add-bold" />}
                onClick={() => setAssetFields(assetFields + 1)}
              >
                <Trans>Add another</Trans>
              </Button>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

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
              label={<Trans>Symbol</Trans>}
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
                    <Trans>Cannot be updated, can be used by anyone</Trans>
                  ) : (
                    <Trans>Can be updated, only usable by you</Trans>
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
                      {values.manager_fee}
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
        <Stack width={1}>
          {renderAssets}

          <IndexWeightsPieChart assets={values.assets} weights={values.weights} />
        </Stack>
      </Stack>

      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          <Trans>Create</Trans>
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export const createIndexSchema = z.object({
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
  assets: z.string().array(), // list of market IDs
  weights: z.string().array(),
});
