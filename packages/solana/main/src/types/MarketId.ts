import { MarketType } from '@normalfinance/solana-sdk';
import { ENUM_UTILS } from '../utils';
import { Opaque } from '.';

// Define MarketKey as an opaque type
export type MarketKey = Opaque<'MarketKey', string>;

export class MarketId {
  constructor(
    readonly marketIndex: number,
    readonly marketType: MarketType
  ) {}

  static createSynthMarket(marketIndex: number) {
    return new MarketId(marketIndex, MarketType.SYNTH);
  }

  static createIndexMarket(marketIndex: number) {
    return new MarketId(marketIndex, MarketType.INDEX);
  }

  static getMarketIdFromKey(key: MarketKey) {
    const [marketType, marketIndex] = key.split('_');
    return new MarketId(parseInt(marketIndex), ENUM_UTILS.toObj(marketType));
  }

  get isSynth() {
    return ENUM_UTILS.match(this.marketType, MarketType.SYNTH);
  }

  get isIndex() {
    return ENUM_UTILS.match(this.marketType, MarketType.INDEX);
  }

  get marketTypeStr() {
    return ENUM_UTILS.toStr(this.marketType);
  }

  /**
   * Returns a unique string that can be used as a key in a map.
   */
  get key() {
    return `${ENUM_UTILS.toStr(this.marketType)}_${this.marketIndex}` as MarketKey;
  }

  equals(other: MarketId) {
    return (
      ENUM_UTILS.match(this.marketType, other.marketType) && this.marketIndex === other.marketIndex
    );
  }
}
