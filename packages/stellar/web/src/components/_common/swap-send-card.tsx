import type { Token } from '@/types/token';
import type { CardProps } from '@mui/material/Card';
import type { SwapFeeInfo } from '@/types/swap-fee-info';
import type { SendPageParams, SwapPageParams } from '@/types/pageParams';

import React from 'react';
import { useTabs } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import SwapCard from './swap-card';
import SendCard from './send-card';
import { CustomTabsSwapSend } from './swap-send-card-custom-card';

export enum MainCardTabs {
  swap = 'swap',
  send = 'send',
}

interface SwapSendCardProps extends CardProps {
  title?: string;
  subheader?: string;
  tokensList?: Token[];
  swapFeeInfo?: SwapFeeInfo;
  activeTab?: MainCardTabs;
  swapParams: SwapPageParams;
  sendParams: SendPageParams;
}

export const SwapSendCard: React.FC<SwapSendCardProps> = ({
  sx,
  title,
  subheader,
  tokensList,
  swapFeeInfo,
  activeTab,
  swapParams,
  sendParams,
  ...other
}) => {
  const theme = useTheme();
  // Use the tabs hook with a default value of 'swap'
  const tabs = useTabs(activeTab ?? MainCardTabs.swap);

  // Define the tabs for this component
  const TABS = [
    { value: MainCardTabs.swap, label: 'Swap' },
    { value: MainCardTabs.send, label: 'Send' },
  ];

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '200px',
        maxWidth: '100%',
        minHeight: '380px',
        maxHeight: '800px',
        padding: '8px',
        paddingTop: '12px',
        paddingBottom: '12px',
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
        sx={{ bgcolor: 'background.paper', padding: 0 }}
        slotProps={{
          flexContainer: { gap: '8px', padding: 0 },
          tab: {
            borderRadius: '8px',
            px: '12px',
            height: '34px',
            color: theme.palette.text.primary,
          },
          selected: {},
          indicator: {
            boxShadow: 'none !important',
            backgroundColor: alpha(theme.palette.grey[500], 0.08),
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </CustomTabsSwapSend>

      {/* Conditionally render a component based on the active tab */}
      {tabs.value === 'swap' ? (
        <SwapCard
          tokensList={tokensList}
          swapFeeInfo={swapFeeInfo}
          sellTokenParam={tokensList?.find((t) => t.name == swapParams.swapSellTokenParam)}
          buyTokenParam={tokensList?.find((t) => t.name == swapParams.swapBuyTokenParam)}
          amountParam={swapParams.swapAmountParam}
        />
      ) : (
        <SendCard
          tokensList={tokensList}
          swapFeeInfo={swapFeeInfo}
          tokenParam={tokensList?.find((t) => t.name === sendParams.sendTokenParam)}
          amountParam={sendParams.sendAmountParam}
          destinationParam={sendParams.sendDestinationParam}
        />
      )}
    </Card>
  );
};
