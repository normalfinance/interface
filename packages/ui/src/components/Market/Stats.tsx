// @mui
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
// hooks
import { fNumber } from 'src/utils/format-number';
import { useResponsive } from 'src/hooks/use-responsive';
// utils
// components

// ----------------------------------------------------------------------

interface Props extends CardProps {
  stats: {
    label: string;
    value: number;
  }[];
}

const Stats = ({ stats, ...other }: Props) => {
  const smUp = useResponsive('up', 'sm');

  return (
    <Card {...other}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={
          <Divider
            orientation={smUp ? 'vertical' : 'horizontal'}
            flexItem
            sx={{ borderStyle: 'dashed' }}
          />
        }
      >
        {stats.map((item, index) => (
          <Stack
            key={item.label}
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={3}
            sx={{ width: 1, py: 5 }}
          >
            <div>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {fNumber(item.value)}
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.72 }}>
                {item.label}
              </Typography>
            </div>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

export { Stats };
