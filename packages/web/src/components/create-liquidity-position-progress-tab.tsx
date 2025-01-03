import { Button, Card, Skeleton, Stack, Typography } from '@mui/material';
import Iconify from './iconify';
import { Trans } from '@/i18n';

// ----------------------------------------------------------------------

type Props = {
  tab: string;
  onEdit: (tab: string) => void;
  children: React.ReactNode;
};

export default function CreateLiquidityPositionProgressTab({ tab, onEdit, children }: Props) {
  return (
    <Card>
      <Stack spacing={1} direction="row" alignItems="flex-start">
        {children}
      </Stack>

      <Stack
        flexGrow={1}
        spacing={1.5}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button
          color="inherit"
          variant="contained"
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={() => onEdit(tab)}
        >
          <Trans>Edit</Trans>
        </Button>
      </Stack>
    </Card>
  );
}
