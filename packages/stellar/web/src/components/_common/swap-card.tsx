import React, { useState } from 'react';
import { Typography, Box, Button, InputBase, CardProps } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import SwapSendPopupButton from './swap-send-popup-button';
import SwapSendEmptyPopupButton from './swap-send-empty-popup-button';
import PickToken from './pick-token';
import { Token } from '@/types/token';

interface SwapCardProps extends CardProps {
  tokensList?: Token[];
}

const SwapCard: React.FC<SwapCardProps> = ({ tokensList, ...other }) => {
  const theme = useTheme();
  // Store the input as a string to control formatting
  const [amount, setAmount] = useState<string>('0');

  // State to control the PickToken popup
  const [open, setOpen] = useState(false);
  // New state to track which button opened the popup (e.g. "sell" or "buy")
  const [activeButton, setActiveButton] = useState<string>('');

  // States for the selected tokens
  const [sellToken, setSellToken] = useState<Token | null>(
    tokensList && tokensList.length > 0 ? tokensList[0] : null
  );
  const [buyToken, setBuyToken] = useState<Token | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    // Prevent negative values: if input contains "-" do nothing
    if (newVal.includes('-')) {
      return;
    }
    // Remove unwanted leading zeros (unless valid decimal like "0.21")
    if (newVal.length > 1 && newVal.startsWith('0') && !newVal.startsWith('0.')) {
      newVal = newVal.replace(/^0+/, '');
    }
    setAmount(newVal);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (amount === '0') {
      setAmount('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (amount === '') {
      setAmount('0');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  const handleTokenSelect = (token: Token) => {
    if (activeButton === 'sell') {
      // If the token selected for sell is already chosen for buy, clear buy
      if (buyToken && buyToken.id === token.id) {
        setBuyToken(null);
      }
      setSellToken(token);
    } else if (activeButton === 'buy') {
      // If the token selected for buy is already chosen for sell, clear sell
      if (sellToken && sellToken.id === token.id) {
        setSellToken(null);
      }
      setBuyToken(token);
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px', // 2px gap between wrapper and button
      }}
    >
      {/* Wrapper for the two boxes */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {/* Absolute Box centered within the wrapper */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '44px',
            height: '44px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '6px',
            overflow: 'hidden',
            zIndex: 2,
            cursor: 'pointer',
            padding: '4px',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 'inherit',
              backgroundColor:
                theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[900],
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[400]
                    : theme.palette.grey[700],
              },
            }}
          >
            <Iconify
              width={24}
              icon="eva:arrow-downward-fill"
              sx={{
                color:
                  theme.palette.mode === 'light'
                    ? theme.palette.text.primary
                    : theme.palette.common.white,
              }}
            />
          </Box>
        </Box>

        {/* First Box: Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            height: '160px',
            padding: theme.spacing(2), // 16px
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.grey[500], 0.08),
          }}
        >
          {/* Inner Box with three items */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Typography variant="body1">Sell</Typography>
            <InputBase
              type="number"
              value={amount}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              inputProps={{
                min: 0,
                style: {
                  fontSize: 'var(--h3-size, 32px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--h3-weight, 700)',
                  lineHeight: 'var(--h3-line-height, 48px)', // 150%
                  letterSpacing: 'var(--h3-letter-spacing, 0px)',
                },
              }}
              sx={{
                width: '100%',
                color:
                  amount === '0' || amount === ''
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary,
                border: 'none',
                padding: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: 'var(--components-nav-item-size, 14px)',
                fontStyle: 'normal',
                fontWeight: 'var(--components-nav-item-weight, 500)',
                lineHeight: 'var(--components-nav-item-line-height, 22px)',
              }}
            >
              ${amount === '' || isNaN(parseFloat(amount)) ? '0.00' : parseFloat(amount).toFixed(2)}
            </Typography>
          </Box>

          {/* Right box: fixed size, no flex growth */}
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              height: '128px',
            }}
          >
            {/* This button opens the popup for "Sell" */}
            {sellToken ? (
              <SwapSendPopupButton
                imgUrl={sellToken.url}
                label={sellToken.shortname}
                onClick={() => {
                  setActiveButton('sell');
                  handleOpen();
                }}
              />
            ) : (
              <SwapSendEmptyPopupButton
                label="Select token"
                onClick={() => {
                  setActiveButton('sell');
                  handleOpen();
                }}
              />
            )}
          </Box>
        </Box>

        {/* Second Box: Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            height: '160px',
            padding: theme.spacing(2), // 16px
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Typography variant="body1">Buy</Typography>
            <Typography
              sx={{
                width: '100%',
                color:
                  amount === '0' || amount === ''
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary,
                border: 'none',
                padding: 0,
                fontSize: 'var(--h3-size, 32px)',
                fontStyle: 'normal',
                fontWeight: 'var(--h3-weight, 700)',
                lineHeight: 'var(--h3-line-height, 48px)', // 150%
                letterSpacing: 'var(--h3-letter-spacing, 0px)',
              }}
            >
              0
            </Typography>
            <Typography
              sx={{
                fontSize: 'var(--components-nav-item-size, 14px)',
                fontStyle: 'normal',
                fontWeight: 'var(--components-nav-item-weight, 500)',
                lineHeight: 'var(--components-nav-item-line-height, 22px)',
                opacity: 0,
              }}
            >
              $0
            </Typography>
          </Box>

          {/* Right box: fixed size, no flex growth */}
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              height: '128px',
            }}
          >
            {/* This button opens the popup for "Buy" */}
            {buyToken ? (
              <SwapSendPopupButton
                imgUrl={buyToken.url}
                label={buyToken.shortname}
                onClick={() => {
                  setActiveButton('buy');
                  handleOpen();
                }}
              />
            ) : (
              <SwapSendEmptyPopupButton
                label="Select token"
                onClick={() => {
                  setActiveButton('buy');
                  handleOpen();
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Button Box */}
      <Box>
        <Button fullWidth variant="soft" color="success" size="large">
          Get started
        </Button>
      </Box>

      <PickToken
        open={open}
        onClose={handleClose}
        buttonSource={activeButton}
        tokensList={tokensList}
        onTokenSelect={handleTokenSelect}
      />
    </Box>
  );
};

export default SwapCard;
