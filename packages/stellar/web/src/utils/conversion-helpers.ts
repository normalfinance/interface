import { fCurrencyTwoDecimals } from './format-number';
import { Token } from '@/types/token';

//1 USDC = 0.000355263 ETH ($1.00) - We are swaping ETH to USDC
export const getConversionText = (sellToken: Token, buyToken: Token): string => {
  const conversion = buyToken.pricestatus / sellToken.pricestatus;
  return `1 ${buyToken.shortname} = ${conversion.toFixed(9)} ${sellToken.shortname} (${fCurrencyTwoDecimals(
    buyToken.pricestatus
  )})`;
};

export const convertFiatToCoin = (fiatAmount: number, tokenPrice: number): number => {
  return fiatAmount / tokenPrice;
};

export const convertCoinToFiat = (coinAmount: number, tokenPrice: number): number => {
  return coinAmount * tokenPrice;
};

// In send-card it gets max amount of token in coutn or $ based on the input mode
export const getMaxAmount = (
  tokenBalance: number,
  tokenPrice: number,
  isFiatMode: boolean
): string => {
  if (isFiatMode) {
    const fiatVal = tokenBalance * tokenPrice;
    return fiatVal.toFixed(6); // Adjust precision as needed
  } else {
    return tokenBalance.toFixed(6);
  }
};
