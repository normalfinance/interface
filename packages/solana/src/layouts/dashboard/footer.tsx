import { Switch, Typography } from '@mui/material';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

// export type NavVerticalProps = React.ComponentProps<'div'> & {};

export function Footer() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#121212',
        color: '#fff',
        padding: '8px 16px',
        fontSize: '14px',
        borderTop: '1px solid #333',
      }}
    >
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
        🟢 Operational &nbsp; | &nbsp;
        <Typography component="span" sx={{ color: '#7f52ff', cursor: 'pointer' }}>
          RPC: Triton RPC Pool 1 (82ms)
        </Typography>
        &nbsp; | &nbsp; Priority Fees: Dynamic
      </Typography>

      
      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        v0.1.0
      </Typography>
    </Box>
  );
}
