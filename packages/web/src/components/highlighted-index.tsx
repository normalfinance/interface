// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: React.ReactNode;
  index: Index;
}

export default function HighlightedIndex({ title, index, sx, ...other }: Props) {
  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Box component="img" src={index.icon} sx={{ width: 48, height: 48 }} />

      <Typography variant="h6" sx={{ mt: 3 }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ mt: 3 }}>
        {index.name}
      </Typography>

      <LinearProgress
        value={24}
        variant="determinate"
        color="inherit"
        sx={{
          my: 2,
          height: 6,
          '&::before': {
            bgcolor: 'divider',
            opacity: 1,
          },
        }}
      />

      <Stack
        direction="row"
        spacing={0.5}
        justifyContent="flex-end"
        sx={{ typography: 'subtitle2' }}
      >
        <Box
          sx={{
            mr: 0.5,
            typography: 'body2',
            color: 'text.disabled',
          }}
        >
          {index.symbol}
        </Box>

        {/* {` / ${fData(total)}`} */}
      </Stack>
    </Card>
  );
}
