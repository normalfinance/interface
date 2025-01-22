import { useBoolean } from '@/hooks/use-boolean';
import LoadingButton from '@mui/lab/LoadingButton';
import { Trans } from '@/i18n';
import Iconify from './iconify';

// ----------------------------------------------------------------------

type Props = {
  buttonText: React.ReactNode;
  buttonSx: any;
  loading: boolean;
  children: React.ReactNode;
};

export default function LoadingButtonModal({ buttonText, buttonSx, loading, children }: Props) {
  const modal = useBoolean();

  return (
    <>
      <LoadingButton
        fullWidth
        variant="soft"
        color="success"
        startIcon={<Iconify icon="solar:alt-arrow-up-bold" />}
        loading={loading}
        onClick={modal.onTrue}
        sx={buttonSx}
      >
        <Trans>{buttonText}</Trans>
      </LoadingButton>

      {modal.value && { children }}
    </>
  );
}
