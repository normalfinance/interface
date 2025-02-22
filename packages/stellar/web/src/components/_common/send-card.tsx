import React from 'react';
import Card from '@mui/material/Card';
import { Typography, Box } from '@mui/material';

const SendCard: React.FC = () => {
  return (
    <Box sx={{ p: 2, mt: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6">Send Card</Typography>
      </Box>
      <Typography variant="body2">
        This is a demo send card. Insert your send functionality here.
      </Typography>
    </Box>
  );
};

export default SendCard;
