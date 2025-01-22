// ----------------------------------------------------------------------

import { RHFTextField } from '@/components/template/hook-form';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';

interface Props {
  title: React.ReactNode;
  index: any; //Index;
}

const DCATab = ({ title, index, ...other }: Props) => {
  const mdUp = useResponsive('up', 'md');

  const summary = useBoolean(true);

  const confirm = useBoolean();

  const renderPriceRange = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Price Range
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            DCA will only be executed if the price falls within the range of your pricing strategy.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Price range (optional)" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="minPrice"
              label="Min Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="maxPrice"
              label="Max Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderSummary = (
    <Card>
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ typography: 'subtitle2' }}
        >
          DCA Summary
          <IconButton size="small" onClick={summary.onToggle}>
            <Iconify
              icon={summary.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </Stack>

        {summary.value && (
          <>
            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Total
              </Box>
              {values.amount}
            </Stack>

            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Total per order
              </Box>
              {fDateTime(modifiedAt)}
            </Stack>

            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                To buy/sell
              </Box>
              {values.otherAsset}
            </Stack>

            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Order interval
              </Box>
              {values.otherAsset}
            </Stack>

            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Start date
              </Box>
              Immediate
            </Stack>

            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Estimated end date
              </Box>
              {values.otherAsset}
            </Stack>

            <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
              <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                Estimated price impact per order
              </Box>
              {values.otherAsset}
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <TokenSelectorWithAmount />

          <TokenSelector />

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
          </Box>

          {renderPriceRange}
        </Grid>

        <Summary />
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

export { DCATab };
