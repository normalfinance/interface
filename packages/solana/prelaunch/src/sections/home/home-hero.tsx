import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { MotionProps, MotionValue, SpringOptions } from 'framer-motion';

import { useRef, useState } from 'react';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CONFIG } from 'src/global-config';

import { varFade, MotionContainer } from 'src/components/animate';

import { HeroBackground } from './components/hero-background';
import SwapCard from '@/components/_common/swap-card';
import { SwapFeeInfo } from '@/types/swap-fee-info';
import { Token } from '@/types/token';
import { SwapSendCard } from '@/components/_common/swap-send-card';
import { Grid2 } from '@mui/material';
import { AccountPopover } from '@/layouts/components/account-popover';
import { usePrivy } from '@privy-io/react-auth';

// ----------------------------------------------------------------------

const smKey: Breakpoint = 'sm';
const mdKey: Breakpoint = 'md';
const lgKey: Breakpoint = 'lg';

const motionProps: MotionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

export function HomeHero({ sx, ...other }: BoxProps) {
  const scrollProgress = useScrollPercent();

  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up(mdKey));

  const distance = mdUp ? scrollProgress.percent : 0;

  const y1 = useTransformY(scrollProgress.scrollY, distance * -7);
  const y2 = useTransformY(scrollProgress.scrollY, distance * -6);
  const y3 = useTransformY(scrollProgress.scrollY, distance * -5);
  // const y4 = useTransformY(scrollProgress.scrollY, distance * -4);
  const y5 = useTransformY(scrollProgress.scrollY, distance * -3);

  const opacity: MotionValue<number> = useTransform(
    scrollProgress.scrollY,
    [0, 1],
    [1, mdUp ? Number((1 - scrollProgress.percent / 100).toFixed(1)) : 1]
  );

  const { authenticated } = usePrivy();

  const renderHeading = () => (
    <m.div {...motionProps}>
      <Box
        component="h1"
        sx={[
          {
            my: 0,
            mx: 'auto',
            maxWidth: 680,
            display: 'flex',
            flexWrap: 'wrap',
            typography: 'h2',
            justifyContent: 'center',
            fontFamily: theme.typography.fontSecondaryFamily,
            [theme.breakpoints.up(lgKey)]: {
              fontSize: theme.typography.pxToRem(72),
              lineHeight: '90px',
            },
          },
        ]}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.24 }}>
          Swap every crypto,
        </Box>
        <Box
          component={m.span}
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={{
            ...theme.mixins.textGradient(
              `300deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.secondary.main} 25%, ${theme.vars.palette.error.main} 50%, ${theme.vars.palette.warning.main} 75%, ${theme.vars.palette.primary.main} 100%`
            ),
            backgroundSize: '400%',
            ml: { xs: 0.75, md: 1, xl: 1.5 },
          }}
        >
          on-chain.
        </Box>
      </Box>
    </m.div>
  );

  const renderText = () => (
    <m.div {...motionProps}>
      <Typography
        variant="body2"
        sx={{
          mx: 'auto',
          [theme.breakpoints.up(smKey)]: { whiteSpace: 'pre' },
          [theme.breakpoints.up(lgKey)]: { fontSize: 20, lineHeight: '36px' },
        }}
      >
        {`Tokenized perps on Solana and Stellar.\nBuy and sell any crypto without bridges or CEXs.`}
      </Typography>
    </m.div>
  );

  const renderIcons = () => (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <m.div {...motionProps}>
        <Typography variant="overline" sx={{ opacity: 0.4 }}>
          Launching Soon On
        </Typography>
      </m.div>

      {!authenticated ? (
        <AccountPopover />
      ) : (
        <Typography
          variant="body2"
          sx={{
            mx: 'auto',
            [theme.breakpoints.up(smKey)]: { whiteSpace: 'pre' },
            [theme.breakpoints.up(lgKey)]: { fontSize: 20, lineHeight: '36px' },
          }}
        >
          Connected, now go complete some quests!
        </Typography>
      )}

      <Box sx={{ gap: 2.5, display: 'flex' }}>
        {['solana', 'stellar'].map((platform) => (
          <m.div {...motionProps} key={platform}>
            <Box
              component="img"
              alt={platform}
              src={`${CONFIG.assetsDir}/assets/icons/platforms/${platform}.svg`}
              sx={[
                {
                  width: 256,
                  height: 256,
                  ...theme.applyStyles('dark', {
                    ...(platform === 'nextjs' && { filter: 'invert(1)' }),
                  }),
                },
              ]}
            />
          </m.div>
        ))}
      </Box>
    </Stack>
  );

  const tokensList: Token[] = [
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=040',
      name: 'Solana',
      shortname: 'SOL',
      owned: true,
      countstatus: 0.02106,
      pricestatus: 134.11,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=040',
      name: 'Bitcoin',
      shortname: 'nBTC',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 86204.89,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://token-icons.s3.amazonaws.com/eth.png',
      name: 'Ethereum',
      shortname: 'nETH',
      owned: true,
      countstatus: 0.02106,
      pricestatus: 2372.25,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=040',
      name: 'Ripple',
      shortname: 'nXRP',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 2.21,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/sui-sui-logo.png?v=040',
      name: 'Sui',
      shortname: 'nSUI',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 2.86,
      featured: true,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 1,
      url: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=040',
      name: 'DogeCoin',
      shortname: 'nDOGE',
      owned: false,
      countstatus: 0.02106,
      pricestatus: 0.2021,
      featured: false,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
    {
      id: 2,
      url: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      name: 'USDC',
      shortname: 'USDC',
      owned: false,
      countstatus: 0,
      pricestatus: 0.9998,
      featured: false,
      address: 'GsD4XPiQtEMrkjtGZcNqK3R9pwDHxZ6ehmSb1sRsvjaX',
    },
  ];

  const swapFeeInfo: SwapFeeInfo = {
    feePercentage: 0.25,
    networkCost: 1.0,
    priceImpact: -0.3,
    maxSlippage: 0.5,
  };

  return (
    <Box
      ref={scrollProgress.elementRef}
      component="section"
      sx={[
        {
          overflow: 'hidden',
          position: 'relative',
          [theme.breakpoints.up(mdKey)]: {
            minHeight: 760,
            height: '100vh',
            maxHeight: 1440,
            display: 'block',
            willChange: 'opacity',
            mt: 'calc(var(--layout-header-desktop-height) * -1)',
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component={m.div}
        style={{ opacity }}
        sx={{
          width: 1,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          transition: theme.transitions.create(['opacity']),
          [theme.breakpoints.up(mdKey)]: { height: 1, position: 'fixed', maxHeight: 'inherit' },
        }}
      >
        <Container
          component={MotionContainer}
          sx={{
            py: 3,
            gap: 5,
            zIndex: 9,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            [theme.breakpoints.up(mdKey)]: {
              flex: '1 1 auto',
              justifyContent: 'center',
              py: 'var(--layout-header-desktop-height)',
            },
          }}
        >
          <Stack spacing={3} sx={{ textAlign: 'center' }}>
            <m.div style={{ y: y1 }}>{renderHeading()}</m.div>
            <m.div style={{ y: y2 }}>{renderText()}</m.div>
            <m.div style={{ y: y3 }}>
              {/* <Grid2 container spacing={3} sx={{ mt: 3 }}>
            <Grid2 size={{ xs: 12, md: 4 }}> */}
              <SwapCard tokensList={tokensList} swapFeeInfo={swapFeeInfo} />
              {/* </Grid2>
              </Grid2> */}
            </m.div>
          </Stack>
          <m.div style={{ y: y5 }}>{renderIcons()}</m.div>
        </Container>

        <HeroBackground />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function useTransformY(value: MotionValue<number>, distance: number) {
  const physics: SpringOptions = {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  };

  return useSpring(useTransform(value, [0, 1], [0, distance]), physics);
}

function useScrollPercent() {
  const elementRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, 'change', (scrollHeight) => {
    let heroHeight = 0;

    if (elementRef.current) {
      heroHeight = elementRef.current.offsetHeight;
    }

    const scrollPercent = Math.floor((scrollHeight / heroHeight) * 100);

    if (scrollPercent >= 100) {
      setPercent(100);
    } else {
      setPercent(Math.floor(scrollPercent));
    }
  });

  return { elementRef, percent, scrollY };
}
