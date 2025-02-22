import React from 'react';
import Card from '@mui/material/Card';
import type { CardProps } from '@mui/material/Card';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Typography } from '@mui/material';
import { useTabs } from 'minimal-shared/hooks';
import { CustomTabsSwapSend } from './swap-send-card-custom-card';
import SwapCard from './swap-card';
import SendCard from './send-card';

interface SwapSendCardProps extends CardProps {
  title?: string;
  subheader?: string;
}

export const SwapSendCard: React.FC<SwapSendCardProps> = ({ sx, title, subheader, ...other }) => {
  // Use the tabs hook with a default value of 'swap'
  const tabs = useTabs('swap');

  // Define the tabs for this component
  const TABS = [
    { value: 'swap', label: 'Swap' },
    { value: 'send', label: 'Send' },
  ];

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '200px',
        maxWidth: '100%',
        minHeight: '400px',
        maxHeight: '600px',
        padding: '8px',
        gap: '2px',
        borderRadius: '16px',
        ...sx,
      }}
      {...other}
    >
      {/* Optional Header */}
      {title && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5">{title}</Typography>
          {subheader && (
            <Typography variant="subtitle2" color="text.secondary">
              {subheader}
            </Typography>
          )}
        </Box>
      )}

      {/* Render the tabs */}
      <CustomTabsSwapSend
        value={tabs.value}
        onChange={tabs.onChange}
        variant="standard"
        slotProps={{ tab: { px: 0 } }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </CustomTabsSwapSend>

      {/* Conditionally render a component based on the active tab */}
      {tabs.value === 'swap' ? <SwapCard /> : <SendCard />}
    </Card>
  );
};
