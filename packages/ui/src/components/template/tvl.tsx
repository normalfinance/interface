import { Skeleton, Typography } from '@mui/material';
import { fCurrency } from '@/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  amount: string;
  color: string;
};

export default function TVL({ loading, amount, color }: Props) {
  if (loading) return <Skeleton variant="text" />;

  return (
    <Typography variant="h3" color={color}>
      {fCurrency(amount)}
    </Typography>
  );
}
