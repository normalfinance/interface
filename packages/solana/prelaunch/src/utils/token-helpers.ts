import { CONFIG } from '@/global-config';

export function getTokenByParam(tokenName?: string) {
  return CONFIG.tokenList.find((t) => t.name === tokenName) || CONFIG.tokenList[0];
}
