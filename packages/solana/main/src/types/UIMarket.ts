import {
  MarketType,
  OracleSource,
  SynthMarketConfig,
  IndexConfig,
} from '@normalfinance/solana-sdk';
import { MarketId } from './MarketId';
import { Config } from '../Config';
import invariant from 'tiny-invariant';
import { USDC_SPOT_MARKET_INDEX } from '../constants';
import { ENUM_UTILS } from '../utils';

export class UIMarket {
  readonly market: SpotMarketConfig | PerpMarketConfig;
  readonly marketId: MarketId;

  constructor(
    readonly marketIndex: number,
    readonly marketType: MarketType
  ) {
    const marketId = new MarketId(marketIndex, marketType);
    const markets = marketId.isSynth ? Config.perpMarketsLookup : Config.spotMarketsLookup;

    const market = markets[marketIndex];

    invariant(
      market,
      `Market not found for type: ${marketId.marketTypeStr}, market index: ${marketIndex}`
    );

    this.marketId = marketId;
    this.market = markets[marketIndex];
  }

  static createSynthMarket(marketIndex: number) {
    return new UIMarket(marketIndex, MarketType.SPOT);
  }

  static createIndexMarket(marketIndex: number) {
    return new UIMarket(marketIndex, MarketType.PERP);
  }

  static fromMarketId(marketId: MarketId) {
    return new UIMarket(marketId.marketIndex, marketId.marketType);
  }

  get isSynth() {
    return this.marketId.isSynth;
  }

  get isIndex() {
    return this.marketId.isIndex;
  }

  get marketTypeStr() {
    return this.marketId.marketTypeStr;
  }

  get key() {
    return this.marketId.key;
  }

  get marketName() {
    return `${this.market.symbol}${this.isSpot ? '/USDC' : ''}`;
  }

  get symbol() {
    return this.market.symbol;
  }

  get isUsdcMarket() {
    return this.isSpot && this.marketIndex === USDC_SPOT_MARKET_INDEX;
  }

  get isStableCoinMarket() {
    return this.isSpot && ENUM_UTILS.match(this.market.oracleSource, OracleSource.PYTH_STABLE_COIN);
  }

  equals(other: UIMarket) {
    return this.marketId.equals(other.marketId);
  }

  baseAssetSymbol(removePrefix = false) {
    let baseAssetSymbol = this.isSynth
      ? (this.market as PerpMarketConfig).baseAssetSymbol
      : this.market.symbol;

    if (removePrefix) {
      baseAssetSymbol = baseAssetSymbol.replace('1K', '').replace('1M', '');
    }

    return baseAssetSymbol;
  }
}
