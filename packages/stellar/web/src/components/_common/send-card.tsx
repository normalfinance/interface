import React, { useState } from 'react';
import Card from '@mui/material/Card';
import { Typography, Box, CardProps, Button, InputBase } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Token } from '@/types/token';
import { fCurrency } from '@/utils/format-number';
import { Iconify } from '../iconify';
import PickToken from './pick-token';

interface SendCardProps extends CardProps {
  tokensList?: Token[];
}

const DEFAULT_TEXT = 'Wallet address or ENS name';

const SendCard: React.FC<SendCardProps> = ({ tokensList = [], ...other }) => {
  const theme = useTheme();

  // 1) Default send token
  const [sendToken, setSendToken] = useState<Token | null>(
    tokensList.length ? tokensList[0] : null
  );

  // 2) Input text state (for wallet address/ENS)
  const [inputValue, setInputValue] = useState<string>(DEFAULT_TEXT);

  // 3) Popup state for token picker
  const [open, setOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<'sell' | 'buy' | 'send' | ''>('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // InputBase handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    // Clear the default text when the user focuses if it's still there.
    if (inputValue === DEFAULT_TEXT) {
      setInputValue('');
    }
  };

  const handleBlur = () => {
    // If the input is left empty, restore the default text.
    if (inputValue.trim() === '') {
      setInputValue(DEFAULT_TEXT);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {/* Token selection area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            height: '278px',
            padding: theme.spacing(2),
            alignItems: 'flex-start',
            borderRadius: '8px 8px 0 0',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.grey[500], 0.08),
            overflow: 'hidden',
          }}
        >
          <Box sx={{ height: '82px' }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              You're sending
            </Typography>
          </Box>
          <Box
            sx={{
              height: '82px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              $0
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              0 ETH
            </Typography>
            <Iconify
              icon="solar:transfer-horizontal-bold-duotone"
              width={14}
              sx={{ color: theme.palette.text.secondary, cursor: 'pointer', rotate: '-90deg' }}
            />
          </Box>
        </Box>
        <Button
          onClick={() => {
            setActiveButton('send');
            handleOpen();
          }}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            padding: theme.spacing(2),
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '0 0 8px 8px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.grey[500], 0.08),
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <Box
              component="img"
              src={sendToken?.url}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {sendToken?.shortname}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  fontSize: '12px',
                }}
              >
                Balance: <Box component="span">{sendToken?.countstatus}</Box>{' '}
                <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                  ({fCurrency((sendToken?.countstatus ?? 0) * (sendToken?.pricestatus ?? 0))})
                </Box>
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Button
              variant="soft"
              color="success"
              size="small"
              sx={{
                fontWeight: 500,
                fontSize: '12px',
                p: 0,
                height: '24px',
                minWidth: '36px',
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Place your Max functionality here if needed.
              }}
            >
              Max
            </Button>
            <Iconify
              width={24}
              icon="eva:arrow-ios-downward-fill"
              sx={{ color: theme.palette.text.primary }}
            />
          </Box>
        </Button>
      </Box>

      {/* Input area for wallet address/ENS */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '12px',
          px: '16px',
          justifyContent: 'center',
          alignItems: 'flex-start',
          borderRadius: '8px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
          overflow: 'hidden',
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.text.primary }}>
          To
        </Typography>
        <InputBase
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          sx={{
            width: '100%',
            border: 'none',
            padding: 0,
            color:
              inputValue === DEFAULT_TEXT
                ? theme.palette.text.secondary
                : theme.palette.text.primary,
            flexGrow: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'clip',
            whiteSpace: 'nowrap',
          }}
          inputProps={{
            style: {
              fontSize: 'var(--body2-size, 14px)',
              fontStyle: 'normal',
              fontWeight: 'var(--h3-weight, 400)',
              lineHeight: 'var(--h3-line-height, 22px)',
              letterSpacing: 'var(--h3-letter-spacing, 0px)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'clip',
              paddingBottom: 0,
            },
          }}
        />
      </Box>

      <Box>
        <Button fullWidth variant="soft" color="success" size="large">
          Send
        </Button>
      </Box>

      {/* Token Picker Popup */}
      <PickToken
        open={open}
        onClose={handleClose}
        buttonSource="send"
        tokensList={tokensList}
        onTokenSelect={(token) => {
          setSendToken(token);
          handleClose();
        }}
      />
    </Box>
  );
};

export default SendCard;
