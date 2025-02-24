import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  InputBase,
  CardProps,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import SwapSendPopupButton from './swap-send-popup-button';
import SwapSendEmptyPopupButton from './swap-send-empty-popup-button';
import PickToken from './pick-token';
import { Token } from '@/types/token';
import { fCurrency, fCurrencyTwoDecimals, fRawPercent } from '@/utils/format-number';
import { SwapFeeInfo } from '@/types/swap-fee-info';
import { GridExpandMoreIcon } from '@mui/x-data-grid';

interface SwapCardProps extends CardProps {
  tokensList?: Token[];
  swapFeeInfo?: SwapFeeInfo;
}

const SwapCard: React.FC<SwapCardProps> = ({ tokensList = [], swapFeeInfo, ...other }) => {
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
  }, [sellToken, buyToken, amount, sellVal]);

  // 8) handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    // Remove unwanted characters: minus and comma
    newVal = newVal.replace(/[-,]/g, '');
    // Remove leading zeros if not a valid decimal
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

  // --- Function to invert tokens and amounts ---
  const handleInvertTokens = () => {
    if (!sellToken || !buyToken) return;

    const oldSellToken = sellToken;
    const oldBuyToken = buyToken;
    const oldAmount = amount;
    const oldBuyAmount = buyAmount;

    // Swap tokens
    setSellToken(oldBuyToken);
    setBuyToken(oldSellToken);

    // Swap amounts: set the input to reflect the old calculated buy amount
    const newTypedAmount = oldBuyAmount > 0 ? oldBuyAmount.toFixed(4).replace(',', '.') : '0';
    setAmount(newTypedAmount);

    // Reset quote states
    setIsLoading(false);
    setQuoteFetched(false);
    setInsufficientBalance(false);
    setBuyAmount(0);
  };

  // 10) Derive the main button’s label
  const getButtonLabel = (): string => {
    if (!sellToken || !buyToken) {
      return 'Select a token';
    }
    if (sellVal <= 0) {
      return 'Enter an amount';
    }
    if (isLoading) {
      return 'Finalizing quote...';
    }
    if (quoteFetched) {
      if (insufficientBalance) {
        return `Insufficient ${sellToken.shortname}`;
      }
      return 'Review';
    }
    return 'Enter an amount';
  };

  // New function: get conversion text in the final quote box.
  const getConversionText = (): string => {
    if (!sellToken || !buyToken) return '';
    // Calculate conversion: 1 buyToken = (buyToken.pricestatus / sellToken.pricestatus) sellToken
    const conversion = buyToken.pricestatus / sellToken.pricestatus;
    return `1 ${buyToken.shortname} = ${conversion.toFixed(9)} ${sellToken.shortname} (${fCurrencyTwoDecimals(
      buyToken.pricestatus
    )})`;
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
          onClick={handleInvertTokens}
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
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              minWidth: 0,
              alignItems: 'flex-start',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              <Typography variant="body1" noWrap>
                Sell
              </Typography>
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
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'clip',
                  },
                }}
                sx={{
                  width: '100%',
                  border: 'none',
                  padding: 0,
                  color:
                    amount === '0' || amount === ''
                      ? theme.palette.text.secondary
                      : theme.palette.text.primary,
                  flexGrow: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'clip',
                  whiteSpace: 'nowrap',
                }}
              />
              <Typography
                noWrap
                sx={{
                  fontSize: 'var(--components-nav-item-size, 14px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--components-nav-item-weight, 500)',
                  lineHeight: 'var(--components-nav-item-line-height, 22px)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                  minWidth: 0,
                }}
              >
                {`${fCurrency(sellFiatValue)}`}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              height: '128px',
              overflow: 'hidden',
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
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              minWidth: 0,
              overflow: 'hidden',
              gap: 2,
            }}
          >
            <Typography variant="body1" noWrap>
              Buy
            </Typography>

            <Box
              sx={{
                maxWidth: '100%',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              <Typography
                sx={{
                  display: 'inline-block',
                  fontSize: 'var(--h3-size, 32px)',
                  fontStyle: 'normal',
                  fontWeight: 'var(--h3-weight, 700)',
                  lineHeight: 'var(--h3-line-height, 48px)',
                  letterSpacing: 'var(--h3-letter-spacing, 0px)',
                  color: !quoteFetched ? theme.palette.text.secondary : theme.palette.text.primary,
                }}
              >
                {quoteFetched && buyToken ? buyAmount.toFixed(4) : 0}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 'var(--components-nav-item-size, 14px)',
                fontStyle: 'normal',
                fontWeight: 'var(--components-nav-item-weight, 500)',
                lineHeight: 'var(--components-nav-item-line-height, 22px)',
                opacity: quoteFetched && buyToken ? 1 : 0,
                whiteSpace: 'nowrap',
                overflow: 'visible',
              }}
            >
              {buyToken ? `${fCurrency(buyToken.pricestatus * buyAmount)}` : '$0'}
            </Typography>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-end',
              height: '128px',
              overflow: 'hidden',
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
          disabled={isLoading}
        >
          {getButtonLabel()}
        </Button>
      </Box>

      {/* Additional box rendered under main button */}
      {quoteFetched && !isLoading && (
        <>
          <Accordion
            defaultExpanded
            disableGutters
            sx={{
              mt: 0,
              backgroundColor: 'transparent !important',
              boxShadow: 'none !important',
              width: '100%',
              padding: '0px !important',
            }}
          >
            <AccordionSummary
              expandIcon={
                <Iconify
                  icon="eva:arrow-ios-upward-fill"
                  width={14}
                  sx={{ color: theme.palette.text.secondary, cursor: 'pointer' }}
                />
              }
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  fontSize: '12px',
                }}
              >
                {sellToken && buyToken ? getConversionText() : ''}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, px: 1 }}>
              <Box
                sx={{
                  mt: 0,
                  px: 0,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {insufficientBalance && (
                  <Box
                    sx={{
                      p: 2,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: alpha(theme.palette.grey[500], 0.08),
                      borderRadius: '8px',
                    }}
                  >
                    <Iconify
                      icon="solar:danger-triangle-bold"
                      width={14}
                      sx={{ color: theme.palette.text.secondary }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        fontSize: '12px',
                      }}
                    >
                      Not enough{' '}
                      <Box component="span" sx={{ color: theme.palette.text.primary }}>
                        {sellToken?.shortname}
                      </Box>{' '}
                      to swap
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    px: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          fontSize: '12px',
                        }}
                      >
                        Fee <Box component="span">({swapFeeInfo?.feePercentage}%)</Box>{' '}
                      </Typography>
                      <Iconify
                        icon="solar:info-circle-bold"
                        width={14}
                        sx={{ color: theme.palette.text.secondary, cursor: 'pointer' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        fontSize: '12px',
                      }}
                    >
                      {fCurrencyTwoDecimals(
                        sellFiatValue * ((swapFeeInfo?.feePercentage ?? 0) / 100)
                      )}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          fontSize: '12px',
                        }}
                      >
                        Network cost
                      </Typography>
                      <Iconify
                        icon="solar:info-circle-bold"
                        width={14}
                        sx={{ color: theme.palette.text.secondary, cursor: 'pointer' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        fontSize: '12px',
                      }}
                    >
                      {fCurrencyTwoDecimals(swapFeeInfo?.networkCost)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          fontSize: '12px',
                        }}
                      >
                        Price impact
                      </Typography>
                      <Iconify
                        icon="solar:info-circle-bold"
                        width={14}
                        sx={{ color: theme.palette.text.secondary, cursor: 'pointer' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        fontSize: '12px',
                      }}
                    >
                      {fRawPercent(swapFeeInfo?.priceImpact)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          fontSize: '12px',
                        }}
                      >
                        Max slippage
                      </Typography>
                      <Iconify
                        icon="solar:info-circle-bold"
                        width={14}
                        sx={{ color: theme.palette.text.secondary, cursor: 'pointer' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                        fontSize: '12px',
                      }}
                    >
                      {fRawPercent(swapFeeInfo?.maxSlippage)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      )}

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
