import {
  AMM_RESERVE_PRECISION_EXP,
  BASE_PRECISION,
  BN,
  Event,
  PRICE_PRECISION,
  PublicKey,
  QUOTE_PRECISION,
  ZERO,
  PRICE_PRECISION_EXP,
  BASE_PRECISION_EXP,
  BigNum,
  NormalClient,
} from '@normalfinance/solana-sdk';

export const matchEnum = (enum1: any, enum2) => {
  return JSON.stringify(enum1) === JSON.stringify(enum2);
};

function enumToObj(enumStr: string) {
  if (!enumStr) return undefined;

  return {
    [enumStr ?? '']: {},
  };
}

function enumToStr(enumStr: Record<string, any>) {
  return Object.keys(enumStr ?? {})?.[0];
}

export const ENUM_UTILS = {
  match: matchEnum,
  toObj: enumToObj,
  toStr: enumToStr,
};

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getStringifiableObjectEntry = (value: any): [any, string] => {
  // If BN
  // if (value instanceof BN) { /* This method would be much safer but don't think it's possible to ensure that instances of classes match when they're in different npm packages */
  if (Object.keys(value).sort().join(',') === 'length,negative,red,words') {
    return [value.toString(), '_bgnm_'];
  }

  // If PublicKey
  // if (value instanceof PublicKey) { { /* This method would be much safer but don't think it's possible to ensure that instances of classes match when they're in different npm packages */
  if (Object.keys(value).sort().join(',') === '_bn') {
    return [value.toString(), '_pbky_'];
  }

  if (typeof value === 'object') {
    return [encodeStringifiableObject(value), ''];
  }

  return [value, ''];
};

/**
 * Converts an objects with potential Pubkeys and BNs in it into a form that can be JSON stringified. When pubkeys get converted a _pbky_ suffix will be added to their key, and _bgnm_ for BNs.
 *
 * e.g.
 * input : {
 * QuoteAmount: BN
 * }
 *
 * output: {
 * _bgnm_QuoteAmount: string
 * }
 * @param value
 * @returns
 */
export const encodeStringifiableObject = (value: any) => {
  if (typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((entry) => encodeStringifiableObject(entry));
  }

  const buildJsonObject = {};

  if (!value) return value;

  Object.entries(value).forEach(([key, val]) => {
    const [convertedVal, keyTag] = getStringifiableObjectEntry(val);
    buildJsonObject[`${keyTag}${key}`] = convertedVal;
  });

  return buildJsonObject;
};

/**
 * Converts a parsed object with potential Pubkeys and BNs in it (in string form) to their proper form. Pubkey values must have a key starting in _pbky_ and BN values must have a key starting in _bnnm_
 *
 * * e.g.
 * input : {
 * _bgnm_QuoteAmount: string
 * }
 *
 * output: {
 * QuoteAmount: BN
 * }
 * @param value
 * @returns
 */
export const decodeStringifiableObject = (value: any) => {
  if (typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((entry) => decodeStringifiableObject(entry));
  }

  const buildJsonObject = {};

  Object.entries(value)
    .filter((val) => val != undefined && val != null)
    .forEach(([key, val]) => {
      if (key.match(/^_pbky_/)) {
        buildJsonObject[key.replace('_pbky_', '')] = new PublicKey(val);
        return;
      }

      if (key.match(/^_bgnm_/)) {
        buildJsonObject[key.replace('_bgnm_', '')] = new BN(val as string);
        return;
      }

      if (typeof val === 'object' && val != undefined && val != null) {
        buildJsonObject[key] = decodeStringifiableObject(val);
        return;
      }

      buildJsonObject[key] = val;
    });

  return buildJsonObject;
};

/**
 * Returns 1 if the first Order is chronologically later than the second Order, -1 if before, 0 if equal
 * @param orderA
 * @param orderB
 * @returns
 */
export const getSortScoreForOrderRecords = (orderA: { slot: number }, orderB: { slot: number }) => {
  if (orderA.slot !== orderB.slot) {
    return orderA.slot > orderB.slot ? 1 : -1;
  }

  return 0;
};

/**
 * Returns the average price for a given base amount and quote amount.
 * @param quoteAmount
 * @param baseAmount
 * @returns PRICE_PRECISION
 */
export const getPriceForBaseAndQuoteAmount = (quoteAmount: BN, baseAmount: BN) => {
  return quoteAmount
    .mul(PRICE_PRECISION)
    .mul(BASE_PRECISION)
    .div(QUOTE_PRECISION)
    .div(BigNum.from(baseAmount, BASE_PRECISION_EXP).val);
};

export const getAnchorEnumString = (enumVal: Record<string, unknown>) => {
  return Object.keys(enumVal)[0];
};
export class Ref<T> {
  public val: T;

  constructor(val: T) {
    this.val = val;
  }

  set(val: T) {
    this.val = val;
  }

  get() {
    return this.val;
  }
}

export class Counter {
  private val = 0;

  get() {
    return this.val;
  }

  increment(value = 1) {
    this.val += value;
  }

  reset() {
    this.val = 0;
  }
}

/**
 * Limits async callbacks to only have one running at a time
 */
export class CallbackLimiter {
  private callbackQueue: any[] = [];

  async send<T>(callback: () => Promise<T>): Promise<
    | {
        status: 'SKIPPED';
      }
    | {
        status: 'RESULT';
        result: T;
      }
  > {
    if (this.callbackQueue.length > 0) {
      return {
        status: 'SKIPPED',
      };
    }

    this.callbackQueue.push(1);

    const response = await callback();

    this.callbackQueue.pop();

    return {
      status: 'RESULT',
      result: response,
    };
  }
}

/**
 * A class which allows a group of switches to seperately turn a multiswitch on or off. The base state is the state of the "multiswitch" when all of the constituent switches are off. When any of the switches are "on" then the multiswitch flips to the opposite state
 *
 * If baseState is on  => any switch being "on" will turn the multiswitch off.
 * If baseState is off => any switch being "off" will turn the multiswitch off.
 */
export class MultiSwitch {
  private switches: string[] = [];
  private switchValue = 0;

  constructor(private baseState: 'on' | 'off' = 'off') {}

  private getSwitchKey(key: string) {
    // If first time using switch, add to list of switches
    if (!this.switches.includes(key)) {
      this.switches.push(key);
    }

    const switchIndex = this.switches.indexOf(key);

    return 2 ** switchIndex;
  }

  public switchOn(key: string) {
    if (this.baseState === 'on') {
      this._switchOff(key);
      return;
    }
    this._switchOn(key);
  }

  public switchOff(key: string) {
    if (this.baseState === 'on') {
      this._switchOn(key);
      return;
    }
    this._switchOff(key);
  }

  private _switchOff(key: string) {
    const switchKey = this.getSwitchKey(key);

    this.switchValue &= ~switchKey;
  }

  private _switchOn(key: string) {
    const switchKey = this.getSwitchKey(key);

    this.switchValue |= switchKey;
  }

  public get isOn() {
    // When the base state is on, then if any switch is on the multi-switch is off
    if (this.baseState === 'on') {
      return this.switchValue === 0;
    }

    if (this.baseState === 'off') {
      return this.switchValue > 0;
    }
  }
}

/**
 * Check if numbers divide exactly, accounting for floating point division annoyingness
 * @param numerator
 * @param denominator
 * @returns
 */
const dividesExactly = (numerator: number, denominator: number) => {
  const division = numerator / denominator;
  const remainder = division % 1;

  if (remainder === 0) return true;

  // Because of floating point weirdness, we're just going to assume that if the remainder after dividing is less than 1/10^6 then the numbers do divide exactly
  if (Math.abs(remainder - 1) < 1 / 10 ** 6) return true;

  return false;
};

const toSnakeCase = (str: string): string => str.replace(/[^\w]/g, '_').toLowerCase();

const toCamelCase = (str: string): string => {
  const words = str.split(/[_\-\s]+/); // split on underscores, hyphens, and spaces
  const firstWord = words[0].toLowerCase();
  const restWords = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return [firstWord, ...restWords].join('');
};

/**
 * Get the size of an insurance fund vault
 * @param spotMarketConfig
 * @param normalClient
 * @returns
 */
const getIfVaultBalance = async (normalClient: NormalClient) => {
  const insuranceFund = normalClient.getInsuranceFundAccount();

  const vaultBalanceBN = new BN(
    (
      await normalClient.provider.connection.getTokenAccountBalance(insuranceFund.vault)
    ).value.amount
  );

  const vaultBalanceBigNum = BigNum.from(vaultBalanceBN, spotMarketConfig.precisionExp);

  return vaultBalanceBigNum;
};

/**
 * Get the current staking APR for a market.
 * @param spotMarketConfig
 * @param normalClient
 * @returns APR Percentage .. e.g. 100 for 100%
 */
const getIfStakingVaultApr = async (
  spotMarketConfig: SpotMarketConfig,
  normalClient: NormalClient
) => {
  const vaultBalance = (await getIfVaultBalance(spotMarketConfig, normalClient)).toNum();

  return syncGetIfStakingVaultApr(spotMarketConfig, normalClient, vaultBalance);
};

const syncGetIfStakingVaultApr = (
  spotMarketConfig: SpotMarketConfig,
  normalClient: NormalClient,
  vaultBalance: number
) => {
  const spotMarket = normalClient.getSpotMarketAccount(spotMarketConfig.marketIndex);

  const revPoolTokens = getTokenAmount(
    spotMarket.revenuePool.scaledBalance,
    spotMarket,
    SpotBalanceType.DEPOSIT
  );

  const userRevenueFactor =
    spotMarket.insuranceFund.totalFactor > 0
      ? spotMarket.insuranceFund.userFactor / spotMarket.insuranceFund.totalFactor
      : 0;

  const revPoolTokensNum = BigNum.from(revPoolTokens, spotMarketConfig.precisionExp).toNum();

  const nextPayment = revPoolTokensNum / 5;

  const revSettlePeriod = spotMarket.insuranceFund.revenueSettlePeriod.toNumber() * 1000;

  const settlesPerYear = Math.floor((1000 * 60 * 60 * 24 * 365) / revSettlePeriod);

  let stakerAPR: number;
  if (vaultBalance > 0) {
    stakerAPR = ((nextPayment * settlesPerYear * userRevenueFactor) / vaultBalance) * 100;
    // Capped at 1000% APR
    stakerAPR = Math.min(1000, stakerAPR);
  } else {
    stakerAPR = 0;
  }

  return stakerAPR;
};

export const aprFromApy = (apy: number, compoundsPerYear: number) => {
  const compoundedAmount = 1 + apy * 0.01;
  const estimatedApr = (Math.pow(compoundedAmount, 1 / compoundsPerYear) - 1) * compoundsPerYear;

  return estimatedApr * 100;
};

/**
 * Helper utility to get a sort score for "tiered" parameters.
 *
 * Example: Want to sort students by Grade, but fall back to using Age if they are equal. This method will accept an array for each student of [grade, age] and return the appropriate sort score for each.
 *
 * @param aScores
 * @param bScores
 * @returns
 */
export const getTieredSortScore = (aScores: number[], bScores: number[]) => {
  const maxIndex = Math.max(aScores.length, bScores.length);

  for (let i = 0; i < maxIndex; i++) {
    const aScore = aScores[i] ?? Number.MIN_SAFE_INTEGER;
    const bScore = bScores[i] ?? Number.MIN_SAFE_INTEGER;

    if (aScore !== bScore) return aScore - bScore;
  }

  return 0;
};

const normalizeBaseAssetSymbol = (symbol: string) => {
  return symbol.replace(/^1M/, '');
};

/**
 * Returns the number of standard deviations between a target value and the history of values to compare it to.
 * @param target
 * @param previousValues
 * @returns
 */
const calculateZScore = (target: number, previousValues: number[]): number => {
  const meanValue = calculateMean(previousValues);
  const standardDeviationValue = calculateStandardDeviation(previousValues, meanValue);

  const zScore = (target - meanValue) / standardDeviationValue;
  return zScore;
};

const calculateMean = (numbers: number[]): number => {
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum / numbers.length;
};

const calculateMedian = (numbers: number[]): number => {
  const sortedNumbers = numbers.sort();
  const middleIndex = Math.floor(sortedNumbers.length / 2);
  if (sortedNumbers.length % 2 === 0) {
    return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
  } else {
    return sortedNumbers[middleIndex];
  }
};

const calculateStandardDeviation = (numbers: number[], mean: number): number => {
  const squaredDifferences = numbers.map((num) => Math.pow(num - mean, 2));
  const sumSquaredDifferences = squaredDifferences.reduce((total, diff) => total + diff, 0);
  const variance = sumSquaredDifferences / numbers.length;
  return Math.sqrt(variance);
};

const glueArray = <T>(size: number, elements: T[]): T[][] => {
  const gluedElements: T[][] = [];

  elements.forEach((element, index) => {
    const gluedIndex = Math.floor(index / size);
    if (gluedElements[gluedIndex]) {
      gluedElements[gluedIndex].push(element);
    } else {
      gluedElements[gluedIndex] = [element];
    }
  });

  return gluedElements;
};

const bnMin = (numbers: BN[]): BN => {
  let min = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i].lt(min)) {
      min = numbers[i];
    }
  }
  return min;
};

const bnMax = (numbers: BN[]): BN => {
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i].gt(max)) {
      max = numbers[i];
    }
  }
  return max;
};

const bnMedian = (numbers: BN[]): BN => {
  const sortedNumbers = numbers.sort((a, b) => a.cmp(b));
  const middleIndex = Math.floor(sortedNumbers.length / 2);
  if (sortedNumbers.length % 2 === 0) {
    return sortedNumbers[middleIndex - 1].add(sortedNumbers[middleIndex]).div(new BN(2));
  } else {
    return sortedNumbers[middleIndex];
  }
};

const bnMean = (numbers: BN[]): BN => {
  let sum = new BN(0);
  for (let i = 0; i < numbers.length; i++) {
    sum = sum.add(numbers[i]);
  }
  return sum.div(new BN(numbers.length));
};

const timedPromise = async <T>(promise: T) => {
  const start = Date.now();
  const promiseResult = await promise;

  return {
    promiseTime: Date.now() - start,
    promiseResult,
  };
};

const chunks = <T>(array: readonly T[], size: number): T[][] => {
  return new Array(Math.ceil(array.length / size))
    .fill(null)
    .map((_, index) => index * size)
    .map((begin) => array.slice(begin, begin + size));
};

export const COMMON_UTILS = {
  getIfVaultBalance: getIfVaultBalance,
  getIfStakingVaultApr: getIfStakingVaultApr,
  syncGetIfStakingVaultApr,
  dividesExactly,
  toSnakeCase,
  toCamelCase,
  getTieredSortScore,
  normalizeBaseAssetSymbol,
  calculateZScore,
  glueArray,
  timedPromise,
  chunks,
  MATH: {
    NUM: {
      mean: calculateMean,
      median: calculateMedian,
    },
    BN: {
      bnMax,
      bnMin,
      bnMean,
      bnMedian,
    },
  },
};
