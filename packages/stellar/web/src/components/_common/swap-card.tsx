import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const SwapCard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px', // 2px gap between children
      }}
    >
      {/* First Box: Header with custom styling */}
      <Box
        sx={{
          display: 'flex',
          minHeight: '117px',
          padding: theme.spacing(2), // 16px
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flex: '1 0 0',
          alignSelf: 'stretch',
          borderRadius: '8px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
        }}
      >
        <Typography variant="h6">Swap Card</Typography>
        {/* Additional header elements can go here */}
      </Box>

      {/* Second Box: Content area with the requested styles */}
      <Box
        sx={{
          display: 'flex',
          minHeight: '117px',
          padding: theme.spacing(2), // 16px
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: '1 0 0',
          alignSelf: 'stretch',
          borderRadius: '8px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="body2">
          This is a demo swap card. Insert your swap functionality here.
        </Typography>
        {/* You can add more elements to this box as needed */}
      </Box>

      {/* Button Box */}
      <Box>
        <Button fullWidth variant="soft" color="success" size="large">
          Execute Swap
        </Button>
      </Box>
    </Box>
  );
};

export default SwapCard;
