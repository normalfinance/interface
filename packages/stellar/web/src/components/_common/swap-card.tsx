import React, { useState, useEffect } from 'react';
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

const SwapCard: React.FC<SwapCardProps> = ({ tokensList = [], ...other }) => {
  const theme = useTheme();

  // 1) States for tokens
  const [sellToken, setSellToken] = useState<Token | null>(
    tokensList.length ? tokensList[0] : null
  );
  const [buyToken, setBuyToken] = useState<Token | null>(null);

  // 2) State for the user’s sell amount
  const [amount, setAmount] = useState<string>('0');

  // 3) Popup states
  const [open, setOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<'sell' | 'buy' | ''>('');

  // 4) Quote states
  const [isLoading, setIsLoading] = useState(false);
  const [quoteFetched, setQuoteFetched] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  // Compute the fiat value for the user’s sell input
  const sellVal = parseFloat(amount) || 0;
  const sellFiatValue = sellToken && sellVal > 0 ? sellVal * sellToken.pricestatus : 0;

  // 5) Example of how much buyToken the user might get
  const [buyAmount, setBuyAmount] = useState<number>(0);

  // 6) Open/close the token picker
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 7) Auto-fetch quote whenever relevant fields change: sellToken, buyToken, amount
  useEffect(() => {
    // Clear old quote state each time we start a new calculation
    setIsLoading(false);
    setQuoteFetched(false);
    setInsufficientBalance(false);
    setBuyAmount(0);

    // Make sure we have both tokens
    if (!sellToken || !buyToken) return;

    // If user hasn't typed anything or typed 0
    const sellVal = parseFloat(amount) || 0;
    if (!amount || sellVal <= 0) {
      return;
    }

    // Start “fetching” quote
    setIsLoading(true);

    // Simulate an async fetch with a 1s delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      setQuoteFetched(true);

      const potentialBuyAmount = sellVal * (sellToken.pricestatus / buyToken.pricestatus);
      setBuyAmount(potentialBuyAmount);

      if (sellVal > sellToken.countstatus) {
        setInsufficientBalance(true);
      }
    }, 1000);

    // Cleanup if user changes input quickly
    return () => clearTimeout(timer);
  }, [sellToken, buyToken, amount]);

  // 8) handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    // No negative
    if (newVal.includes('-')) return;
    // Remove leading zeros if not decimal
    if (newVal.length > 1 && newVal.startsWith('0') && !newVal.startsWith('0.')) {
      newVal = newVal.replace(/^0+/, '');
    }
    setAmount(newVal);
  };
  const handleFocus = () => {
    if (amount === '0') setAmount('');
  };
  const handleBlur = () => {
    if (amount === '') setAmount('0');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-') e.preventDefault();
  };

  // 9) handle token selection from popup
  const handleTokenSelect = (token: Token) => {
    if (activeButton === 'sell') {
      // If it’s the same as buy, clear buy
      if (buyToken && buyToken.id === token.id) {
        setBuyToken(null);
      }
      setSellToken(token);
    } else if (activeButton === 'buy') {
      if (sellToken && sellToken.id === token.id) {
        setSellToken(null);
      }
      setBuyToken(token);
    }
  };

  // 10) Derive the big button’s label
  const getButtonLabel = (): string => {
    // 1) No tokens selected
    if (!sellToken || !buyToken) {
      return 'Select a token';
    }

    // 2) Check user’s sell amount
    const sellVal = parseFloat(amount) || 0;
    if (sellVal <= 0) {
      return 'Enter an amount';
    }

    // 3) If loading
    if (isLoading) {
      return 'Finalizing quote...';
    }

    // 4) Quote fetched
    if (quoteFetched) {
      if (insufficientBalance) {
        return `Insufficient ${sellToken.shortname}`;
      }
      return 'Review';
    }

    // 5) If not loading and quote hasn’t been fetched yet (rare edge case),
    //    you can choose which label to show. Usually "Enter an amount"
    //    or "Select a token" will catch most states.
    //    Or you can do "Finalizing quote..." if you're sure the effect
    //    is about to fetch.
    return 'Enter an amount';
  };
  const handleMainButtonClick = () => {
    const label = getButtonLabel();
    if (label === 'Select a token') {
      // Possibly do something like open whichever token is missing
    } else if (label === 'Enter an amount') {
      // Focus the input?
    } else if (label === 'Finalizing quote...') {
      // do nothing or show a message
    } else if (label.startsWith('Insufficient')) {
      // show an error or do nothing
    } else if (label === 'Review') {
      // open a review popup
      console.log('Open Review Popup');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {/* Container with the 2 token boxes */}
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {/* Arrow in the middle */}
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

        {/* SELL Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            height: '160px',
            padding: theme.spacing(2),
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.grey[500], 0.08),
          }}
        >
          {/* Sell Input */}
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
                  lineHeight: 'var(--h3-line-height, 48px)',
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
              {`$${sellFiatValue.toFixed(2)}`}
            </Typography>
          </Box>

          {/* Sell Token Button */}
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

        {/* BUY Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            height: '160px',
            padding: theme.spacing(2),
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {/* Show how many buy tokens the user might get */}
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
                color: !quoteFetched ? theme.palette.text.secondary : theme.palette.text.primary,
                border: 'none',
                padding: 0,
                fontSize: 'var(--h3-size, 32px)',
                fontStyle: 'normal',
                fontWeight: 'var(--h3-weight, 700)',
                lineHeight: 'var(--h3-line-height, 48px)',
                letterSpacing: 'var(--h3-letter-spacing, 0px)',
              }}
            >
              {quoteFetched && buyToken ? buyAmount.toFixed(4) : 0}
            </Typography>
            <Typography
              sx={{
                fontSize: 'var(--components-nav-item-size, 14px)',
                fontStyle: 'normal',
                fontWeight: 'var(--components-nav-item-weight, 500)',
                lineHeight: 'var(--components-nav-item-line-height, 22px)',
                opacity: quoteFetched && buyToken ? 1 : 0,
              }}
            >
              {buyToken ? `$${(buyToken.pricestatus * buyAmount).toFixed(2)}` : '$0'}
            </Typography>
          </Box>

          {/* Buy Token Button */}
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

      {/* Main button with multiple states */}
      <Box>
        <Button
          fullWidth
          variant="soft"
          color="success"
          size="large"
          onClick={handleMainButtonClick}
          disabled={isLoading} // disable if loading, optional
        >
          {getButtonLabel()}
        </Button>
      </Box>

      {/* Token Picker Popup */}
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
