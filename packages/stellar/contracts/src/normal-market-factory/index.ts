import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAPJ6T4ICUHQ5FQU2EUQJCCKGZYMAO7C3T2USW2HMQJUX4P2XG7FA23L",
  }
} as const

// export const Errors = {
//   1: {message:"AlreadyInitialized"},

//   2: {message:"NotAuthorized"},

//   3: {message:"MarketNotFound"},

//   4: {message:"AdminNotSet"}
// }

export interface MarketTupleKey {
  token_a: string;
  token_b: string;
}

export const Errors = {
  100: {message:"AlreadyInitialized"},

  1: {message:"MarketNotFound"}, 

  2: {message:"NotAuthorized"},

  3: {message:"AdminNotSet"},

  4: {message:"TransferAmountTooSmallAfterFees"},

  5: {message:"InvalidFee"},

  7: {message:"TooSoonToRebalance"},

  8: {message:"InsufficientDeposit"},

  9: {message:"OracleNonPositive"},

  10: {message:"OracleTooVolatile"},

  11: {message:"OracleTooUncertain"},

  12: {message:"OracleStaleForMargin"},

  13: {message:"OracleInsufficientDataPoints"},

  14: {message:"OracleStaleForAMM"},

  15: {message:"MathError"},

  16: {message:"TokenNotAllowed"},

  17: {message:"BnConversionError"},

  18: {message:"CastingFailure"},

  19: {message:"FailedUnwrap"},

  20: {message:"InsufficientFunds"}
}
export const CastErrors = {
  1: {message:"CastingFailure"}
}
export type OracleValidity = {tag: "NonPositive", values: void} | {tag: "TooVolatile", values: void} | {tag: "TooUncertain", values: void} | {tag: "StaleForMargin", values: void} | {tag: "InsufficientDataPoints", values: void} | {tag: "StaleForAMM", values: void} | {tag: "Valid", values: void};

export type NormalAction = {tag: "Liquidate", values: void} | {tag: "MarginCalc", values: void} | {tag: "UpdateTwap", values: void} | {tag: "UpdateAMMCurve", values: void} | {tag: "OracleOrderPrice", values: void} | {tag: "IndexPricing", values: void};


export interface OracleStatus {
  mark_too_divergent: boolean;
  oracle_res_price_spread_pct: i64;
  oracle_validity: OracleValidity;
  price_data: OraclePriceData;
}

export const MathErrors = {
  1: {message:"MathError"}
}
export const OtherErrors = {
  1: {message:"FailedUnwrap"}
}

export interface VecDeque {
  data: Array<u32>;
}


export interface HistoricalOracleData {
  /**
 * precision: PRICE_PRECISION
 */
last_oracle_conf: u64;
  /**
 * number of slots since last update
 */
last_oracle_delay: u64;
  /**
 * precision: PRICE_PRECISION
 */
last_oracle_price: i64;
  /**
 * precision: PRICE_PRECISION
 */
last_oracle_price_twap: i64;
  /**
 * unix_timestamp of last snapshot
 */
last_oracle_price_twap_ts: u64;
}

export type OracleSource = {tag: "Band", values: void};


export interface OraclePriceData {
  confidence: u64;
  delay: u64;
  has_sufficient_data_points: boolean;
  price: i64;
}


export interface OracleGuardRails {
  price_divergence: PriceDivergenceGuardRails;
  validity: ValidityGuardRails;
}


export interface PriceDivergenceGuardRails {
  mark_oracle_percent_divergence: u64;
  oracle_twap_5min_perc_div: u64;
}


export interface ValidityGuardRails {
  confidence_interval_max_size: u64;
  slots_before_stale_for_amm: i64;
  slots_before_stale_for_margin: i64;
  too_volatile_ratio: i64;
}

/**
 * Auction types
 */
export type AuctionType = {tag: "Collateral", values: void} | {tag: "Debt", values: void} | {tag: "Surplus", values: void};

export type AuctionLocation = {tag: "Native", values: void} | {tag: "External", values: void};


export interface Auction {
  amount: i128;
  direction: OrderDirection;
  duration: u64;
  end_price: u64;
  location: AuctionLocation;
  start_price: u64;
  start_ts: u64;
  total_auctioned: i128;
}


export interface IndexAsset {
  last_updated_ts: i64;
  /**
 * Address of the synth market
 */
market: string;
  /**
 * The portfolio allocation of the asset
 */
weight: i128;
}


export interface IndexParams {
  blacklist: Array<string>;
  component_assets: Array<IndexAsset>;
  decimal: u32;
  initial_deposit: i128;
  initial_price: i128;
  is_public: boolean;
  manager_fee_bps: i64;
  name: string;
  oracle: string;
  oracle_source: OracleSource;
  quote_token: string;
  rebalance_threshold: u64;
  symbol: string;
  whitelist: Array<string>;
}


export interface MarketFactoryConfig {
  admin: string;
  governor: string;
  insurance: string;
  market_wasm_hash: Buffer;
  oracle_guard_rails: OracleGuardRails;
  super_keepers: Array<string>;
  token_wasm_hash: Buffer;
}

export type SynthTier = {tag: "A", values: void} | {tag: "B", values: void} | {tag: "C", values: void} | {tag: "Speculative", values: void} | {tag: "HighlySpeculative", values: void} | {tag: "Isolated", values: void};


export interface MarketParams {
  active_status: boolean;
  debt_ceiling: u128;
  debt_floor: u32;
  decimals: u32;
  if_liquidation_fee: u32;
  imf_factor: u32;
  liquidation_penalty: u32;
  liquidator_fee: u32;
  lp_token_symbol: string;
  margin_ratio_initial: u32;
  margin_ratio_maintenance: u32;
  name: string;
  oracle: string;
  oracle_source: OracleSource;
  pool: PoolParams;
  quote_token: string;
  quote_token_symbol: string;
  synth_target_token_symbol: string;
  synth_token_name: string;
  synth_token_symbol: string;
  tier: SynthTier;
  token_decimals: u32;
}


/**
 * This struct is used to return a query result with the total amount of LP tokens and assets in a specific pool.
 */
export interface MarketResponse {
  name: string;
}


export interface MarketInfo {
  market_address: string;
  market_response: MarketResponse;
}

export type OrderDirection = {tag: "Buy", values: void} | {tag: "Sell", values: void};


export interface PoolParams {
  fee_rate: i64;
  initial_sqrt_price: u128;
  max_allowed_slippage_bps: i64;
  max_allowed_variance_bps: i64;
  oracle: string;
  oracle_source: OracleSource;
  protocol_fee_rate: i64;
  tick_spacing: u32;
}


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, governor, insurance, market_wasm_hash, token_wasm_hash}: {admin: string, governor: string, insurance: string, market_wasm_hash: Buffer, token_wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_market transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_market: ({params}: {params: MarketParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a update_super_keepers transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_super_keepers: ({to_add, to_remove}: {to_add: Array<string>, to_remove: Array<string>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a update_wasm_hashes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_wasm_hashes: ({market_wasm_hash, token_wasm_hash}: {market_wasm_hash: Option<Buffer>, token_wasm_hash: Option<Buffer>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a update_oracle_guard_rails transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_oracle_guard_rails: ({oracle_guard_rails}: {oracle_guard_rails: OracleGuardRails}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a query_markets transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_markets: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a query_market_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_market_details: ({market_address}: {market_address: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<MarketInfo>>

  /**
   * Construct and simulate a query_all_markets_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_all_markets_details: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<MarketInfo>>>

  /**
   * Construct and simulate a query_for_market_by_token_pair transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_for_market_by_token_pair: ({token_a, token_b}: {token_a: string, token_b: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admin: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_config transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_config: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<MarketFactoryConfig>>

  /**
   * Construct and simulate a update transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update: ({new_wasm_hash}: {new_wasm_hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  // static async deploy<T = Client>(
  //   /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
  //   options: MethodOptions &
  //     Omit<ContractClientOptions, "contractId"> & {
  //       /** The hash of the Wasm blob, which must already be installed on-chain. */
  //       wasmHash: Buffer | string;
  //       /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
  //       salt?: Buffer | Uint8Array;
  //       /** The format used to decode `wasmHash`, if it's provided as a string. */
  //       format?: "hex" | "base64";
  //     }
  // ): Promise<AssembledTransaction<T>> {
  //   ContractClient.
  //   return ContractClient.deploy(null, options)
  // }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAhnb3Zlcm5vcgAAABMAAAAAAAAACWluc3VyYW5jZQAAAAAAABMAAAAAAAAAEG1hcmtldF93YXNtX2hhc2gAAAPuAAAAIAAAAAAAAAAPdG9rZW5fd2FzbV9oYXNoAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAAAAAAANY3JlYXRlX21hcmtldAAAAAAAAAEAAAAAAAAABnBhcmFtcwAAAAAH0AAAAAxNYXJrZXRQYXJhbXMAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAUdXBkYXRlX3N1cGVyX2tlZXBlcnMAAAACAAAAAAAAAAZ0b19hZGQAAAAAA+oAAAATAAAAAAAAAAl0b19yZW1vdmUAAAAAAAPqAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAASdXBkYXRlX3dhc21faGFzaGVzAAAAAAACAAAAAAAAABBtYXJrZXRfd2FzbV9oYXNoAAAD6AAAA+4AAAAgAAAAAAAAAA90b2tlbl93YXNtX2hhc2gAAAAD6AAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAAAAAAAZdXBkYXRlX29yYWNsZV9ndWFyZF9yYWlscwAAAAAAAAEAAAAAAAAAEm9yYWNsZV9ndWFyZF9yYWlscwAAAAAH0AAAABBPcmFjbGVHdWFyZFJhaWxzAAAAAA==",
        "AAAAAAAAAAAAAAANcXVlcnlfbWFya2V0cwAAAAAAAAAAAAABAAAD6gAAABM=",
        "AAAAAAAAAAAAAAAUcXVlcnlfbWFya2V0X2RldGFpbHMAAAABAAAAAAAAAA5tYXJrZXRfYWRkcmVzcwAAAAAAEwAAAAEAAAfQAAAACk1hcmtldEluZm8AAA==",
        "AAAAAAAAAAAAAAAZcXVlcnlfYWxsX21hcmtldHNfZGV0YWlscwAAAAAAAAAAAAABAAAD6gAAB9AAAAAKTWFya2V0SW5mbwAA",
        "AAAAAAAAAAAAAAAecXVlcnlfZm9yX21hcmtldF9ieV90b2tlbl9wYWlyAAAAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEwAAAAEAAAAT",
        "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAKZ2V0X2NvbmZpZwAAAAAAAAAAAAEAAAfQAAAAE01hcmtldEZhY3RvcnlDb25maWcA",
        "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAABAAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAA1Ob3RBdXRob3JpemVkAAAAAAAAAgAAAAAAAAAOTWFya2V0Tm90Rm91bmQAAAAAAAMAAAAAAAAAC0FkbWluTm90U2V0AAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADk1hcmtldFR1cGxlS2V5AAAAAAACAAAAAAAAAAd0b2tlbl9hAAAAABMAAAAAAAAAB3Rva2VuX2IAAAAAEw==",
        "AAAABAAAAAAAAAAAAAAACUVycm9yQ29kZQAAAAAAABMAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAZAAAAAAAAAANTm90QXV0aG9yaXplZAAAAAAAAAIAAAAAAAAAC0FkbWluTm90U2V0AAAAAAMAAAAAAAAAH1RyYW5zZmVyQW1vdW50VG9vU21hbGxBZnRlckZlZXMAAAAABAAAAAAAAAAKSW52YWxpZEZlZQAAAAAABQAAAAAAAAASVG9vU29vblRvUmViYWxhbmNlAAAAAAAHAAAAAAAAABNJbnN1ZmZpY2llbnREZXBvc2l0AAAAAAgAAAAAAAAAEU9yYWNsZU5vblBvc2l0aXZlAAAAAAAACQAAAAAAAAART3JhY2xlVG9vVm9sYXRpbGUAAAAAAAAKAAAAAAAAABJPcmFjbGVUb29VbmNlcnRhaW4AAAAAAAsAAAAAAAAAFE9yYWNsZVN0YWxlRm9yTWFyZ2luAAAADAAAAAAAAAAcT3JhY2xlSW5zdWZmaWNpZW50RGF0YVBvaW50cwAAAA0AAAAAAAAAEU9yYWNsZVN0YWxlRm9yQU1NAAAAAAAADgAAAAAAAAAJTWF0aEVycm9yAAAAAAAADwAAAAAAAAAPVG9rZW5Ob3RBbGxvd2VkAAAAABAAAAAAAAAAEUJuQ29udmVyc2lvbkVycm9yAAAAAAAAEQAAAAAAAAAOQ2FzdGluZ0ZhaWx1cmUAAAAAABIAAAAAAAAADEZhaWxlZFVud3JhcAAAABMAAAAAAAAAEUluc3VmZmljaWVudEZ1bmRzAAAAAAAAFA==",
        "AAAABAAAAAAAAAAAAAAACUVycm9yQ29kZQAAAAAAAAEAAAAAAAAADkNhc3RpbmdGYWlsdXJlAAAAAAAB",
        "AAAAAgAAAAAAAAAAAAAADk9yYWNsZVZhbGlkaXR5AAAAAAAHAAAAAAAAAAAAAAALTm9uUG9zaXRpdmUAAAAAAAAAAAAAAAALVG9vVm9sYXRpbGUAAAAAAAAAAAAAAAAMVG9vVW5jZXJ0YWluAAAAAAAAAAAAAAAOU3RhbGVGb3JNYXJnaW4AAAAAAAAAAAAAAAAAFkluc3VmZmljaWVudERhdGFQb2ludHMAAAAAAAAAAAAAAAAAC1N0YWxlRm9yQU1NAAAAAAAAAAAAAAAABVZhbGlkAAAA",
        "AAAAAgAAAAAAAAAAAAAADE5vcm1hbEFjdGlvbgAAAAYAAAAAAAAAAAAAAAlMaXF1aWRhdGUAAAAAAAAAAAAAAAAAAApNYXJnaW5DYWxjAAAAAAAAAAAAAAAAAApVcGRhdGVUd2FwAAAAAAAAAAAAAAAAAA5VcGRhdGVBTU1DdXJ2ZQAAAAAAAAAAAAAAAAAQT3JhY2xlT3JkZXJQcmljZQAAAAAAAAAAAAAADEluZGV4UHJpY2luZw==",
        "AAAAAQAAAAAAAAAAAAAADE9yYWNsZVN0YXR1cwAAAAQAAAAAAAAAEm1hcmtfdG9vX2RpdmVyZ2VudAAAAAAAAQAAAAAAAAAbb3JhY2xlX3Jlc19wcmljZV9zcHJlYWRfcGN0AAAAAAcAAAAAAAAAD29yYWNsZV92YWxpZGl0eQAAAAfQAAAADk9yYWNsZVZhbGlkaXR5AAAAAAAAAAAACnByaWNlX2RhdGEAAAAAB9AAAAAPT3JhY2xlUHJpY2VEYXRhAA==",
        "AAAABAAAAAAAAAAAAAAACUVycm9yQ29kZQAAAAAAAAEAAAAAAAAACU1hdGhFcnJvcgAAAAAAAAE=",
        "AAAABAAAAAAAAAAAAAAACUVycm9yQ29kZQAAAAAAAAEAAAAAAAAADEZhaWxlZFVud3JhcAAAAAE=",
        "AAAAAQAAAAAAAAAAAAAACFZlY0RlcXVlAAAAAQAAAAAAAAAEZGF0YQAAA+oAAAAE",
        "AAAAAQAAAAAAAAAAAAAAFEhpc3RvcmljYWxPcmFjbGVEYXRhAAAABQAAABpwcmVjaXNpb246IFBSSUNFX1BSRUNJU0lPTgAAAAAAEGxhc3Rfb3JhY2xlX2NvbmYAAAAGAAAAIW51bWJlciBvZiBzbG90cyBzaW5jZSBsYXN0IHVwZGF0ZQAAAAAAABFsYXN0X29yYWNsZV9kZWxheQAAAAAAAAYAAAAacHJlY2lzaW9uOiBQUklDRV9QUkVDSVNJT04AAAAAABFsYXN0X29yYWNsZV9wcmljZQAAAAAAAAcAAAAacHJlY2lzaW9uOiBQUklDRV9QUkVDSVNJT04AAAAAABZsYXN0X29yYWNsZV9wcmljZV90d2FwAAAAAAAHAAAAH3VuaXhfdGltZXN0YW1wIG9mIGxhc3Qgc25hcHNob3QAAAAAGWxhc3Rfb3JhY2xlX3ByaWNlX3R3YXBfdHMAAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAADE9yYWNsZVNvdXJjZQAAAAEAAAAAAAAAAAAAAARCYW5k",
        "AAAAAQAAAAAAAAAAAAAAD09yYWNsZVByaWNlRGF0YQAAAAAEAAAAAAAAAApjb25maWRlbmNlAAAAAAAGAAAAAAAAAAVkZWxheQAAAAAAAAYAAAAAAAAAGmhhc19zdWZmaWNpZW50X2RhdGFfcG9pbnRzAAAAAAABAAAAAAAAAAVwcmljZQAAAAAAAAc=",
        "AAAAAQAAAAAAAAAAAAAAEE9yYWNsZUd1YXJkUmFpbHMAAAACAAAAAAAAABBwcmljZV9kaXZlcmdlbmNlAAAH0AAAABlQcmljZURpdmVyZ2VuY2VHdWFyZFJhaWxzAAAAAAAAAAAAAAh2YWxpZGl0eQAAB9AAAAASVmFsaWRpdHlHdWFyZFJhaWxzAAA=",
        "AAAAAQAAAAAAAAAAAAAAGVByaWNlRGl2ZXJnZW5jZUd1YXJkUmFpbHMAAAAAAAACAAAAAAAAAB5tYXJrX29yYWNsZV9wZXJjZW50X2RpdmVyZ2VuY2UAAAAAAAYAAAAAAAAAGW9yYWNsZV90d2FwXzVtaW5fcGVyY19kaXYAAAAAAAAG",
        "AAAAAQAAAAAAAAAAAAAAElZhbGlkaXR5R3VhcmRSYWlscwAAAAAABAAAAAAAAAAcY29uZmlkZW5jZV9pbnRlcnZhbF9tYXhfc2l6ZQAAAAYAAAAAAAAAGnNsb3RzX2JlZm9yZV9zdGFsZV9mb3JfYW1tAAAAAAAHAAAAAAAAAB1zbG90c19iZWZvcmVfc3RhbGVfZm9yX21hcmdpbgAAAAAAAAcAAAAAAAAAEnRvb192b2xhdGlsZV9yYXRpbwAAAAAABw==",
        "AAAAAgAAAA1BdWN0aW9uIHR5cGVzAAAAAAAAAAAAAAtBdWN0aW9uVHlwZQAAAAADAAAAAAAAACVzZWxsaW5nIGNvbGxhdGVyYWwgZnJvbSBhIGxpcXVpZGF0aW9uAAAAAAAACkNvbGxhdGVyYWwAAAAAAAAAAABXc2VsbGluZyBuZXdseSBtaW50ZWQgTk9STSB0byBjb3ZlciBQcm90b2NvbCBEZWJ0ICh0aGUgZGVmaWNpdCBmcm9tIENvbGxhdGVyYWwgQXVjdGlvbnMpAAAAAAREZWJ0AAAAAAAAAF9zZWxsaW5nIGV4Y2VzcyBzeW50aGV0aWMgdG9rZW4gcHJvY2VlZHMgb3ZlciB0aGUgSW5zdXJhbmNlIEZ1bmQgbWF4IGxpbWl0IGZvciBOT1JNIHRvIGJlIGJ1cm5lZAAAAAAHU3VycGx1cwA=",
        "AAAAAgAAAAAAAAAAAAAAD0F1Y3Rpb25Mb2NhdGlvbgAAAAACAAAAAAAAADVTZWxsIHRoZSBhc3NldCBkaXJlY3RseSB0byB1c2VycyB2aWEgTm9ybWFsIGludGVyZmFjZQAAAAAAAAZOYXRpdmUAAAAAAAAAAAAiU2VsbCB0aGUgYXNzZXQgdmlhIGEgM3JkLXBhcnR5IERFWAAAAAAACEV4dGVybmFs",
        "AAAAAQAAAAAAAAAAAAAAB0F1Y3Rpb24AAAAACAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAlkaXJlY3Rpb24AAAAAAAfQAAAADk9yZGVyRGlyZWN0aW9uAAAAAAAAAAAACGR1cmF0aW9uAAAABgAAAAAAAAAJZW5kX3ByaWNlAAAAAAAABgAAAAAAAAAIbG9jYXRpb24AAAfQAAAAD0F1Y3Rpb25Mb2NhdGlvbgAAAAAAAAAAC3N0YXJ0X3ByaWNlAAAAAAYAAAAAAAAACHN0YXJ0X3RzAAAABgAAAAAAAAAPdG90YWxfYXVjdGlvbmVkAAAAAAs=",
        "AAAAAQAAAAAAAAAAAAAACkluZGV4QXNzZXQAAAAAAAMAAAAAAAAAD2xhc3RfdXBkYXRlZF90cwAAAAAHAAAAG0FkZHJlc3Mgb2YgdGhlIHN5bnRoIG1hcmtldAAAAAAGbWFya2V0AAAAAAATAAAAJVRoZSBwb3J0Zm9saW8gYWxsb2NhdGlvbiBvZiB0aGUgYXNzZXQAAAAAAAAGd2VpZ2h0AAAAAAAL",
        "AAAAAQAAAAAAAAAAAAAAC0luZGV4UGFyYW1zAAAAAA4AAAAAAAAACWJsYWNrbGlzdAAAAAAAA+oAAAATAAAAAAAAABBjb21wb25lbnRfYXNzZXRzAAAD6gAAB9AAAAAKSW5kZXhBc3NldAAAAAAAAAAAAAdkZWNpbWFsAAAAAAQAAAAAAAAAD2luaXRpYWxfZGVwb3NpdAAAAAALAAAAAAAAAA1pbml0aWFsX3ByaWNlAAAAAAAACwAAAAAAAAAJaXNfcHVibGljAAAAAAAAAQAAAAAAAAAPbWFuYWdlcl9mZWVfYnBzAAAAAAcAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZvcmFjbGUAAAAAABMAAAAAAAAADW9yYWNsZV9zb3VyY2UAAAAAAAfQAAAADE9yYWNsZVNvdXJjZQAAAAAAAAALcXVvdGVfdG9rZW4AAAAAEwAAAAAAAAATcmViYWxhbmNlX3RocmVzaG9sZAAAAAAGAAAAAAAAAAZzeW1ib2wAAAAAABAAAAAAAAAACXdoaXRlbGlzdAAAAAAAA+oAAAAT",
        "AAAAAQAAAAAAAAAAAAAAE01hcmtldEZhY3RvcnlDb25maWcAAAAABwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAhnb3Zlcm5vcgAAABMAAAAAAAAACWluc3VyYW5jZQAAAAAAABMAAAAAAAAAEG1hcmtldF93YXNtX2hhc2gAAAPuAAAAIAAAAAAAAAASb3JhY2xlX2d1YXJkX3JhaWxzAAAAAAfQAAAAEE9yYWNsZUd1YXJkUmFpbHMAAAAAAAAADXN1cGVyX2tlZXBlcnMAAAAAAAPqAAAAEwAAAAAAAAAPdG9rZW5fd2FzbV9oYXNoAAAAA+4AAAAg",
        "AAAAAgAAAAAAAAAAAAAACVN5bnRoVGllcgAAAAAAAAYAAAAAAAAAH21heCBpbnN1cmFuY2UgY2FwcGVkIGF0IEEgbGV2ZWwAAAAAAUEAAAAAAAAAAAAAH21heCBpbnN1cmFuY2UgY2FwcGVkIGF0IEIgbGV2ZWwAAAAAAUIAAAAAAAAAAAAAH21heCBpbnN1cmFuY2UgY2FwcGVkIGF0IEMgbGV2ZWwAAAAAAUMAAAAAAAAAAAAADG5vIGluc3VyYW5jZQAAAAtTcGVjdWxhdGl2ZQAAAAAAAAAAJG5vIGluc3VyYW5jZSwgYW5vdGhlciB0cmFuY2hlcyBiZWxvdwAAABFIaWdobHlTcGVjdWxhdGl2ZQAAAAAAAAAAAAAqbm8gaW5zdXJhbmNlLCBvbmx5IHNpbmdsZSBwb3NpdGlvbiBhbGxvd2VkAAAAAAAISXNvbGF0ZWQ=",
        "AAAAAQAAAAAAAAAAAAAADE1hcmtldFBhcmFtcwAAABYAAAAAAAAADWFjdGl2ZV9zdGF0dXMAAAAAAAABAAAAAAAAAAxkZWJ0X2NlaWxpbmcAAAAKAAAAAAAAAApkZWJ0X2Zsb29yAAAAAAAEAAAAAAAAAAhkZWNpbWFscwAAAAQAAAAAAAAAEmlmX2xpcXVpZGF0aW9uX2ZlZQAAAAAABAAAAAAAAAAKaW1mX2ZhY3RvcgAAAAAABAAAAAAAAAATbGlxdWlkYXRpb25fcGVuYWx0eQAAAAAEAAAAAAAAAA5saXF1aWRhdG9yX2ZlZQAAAAAABAAAAAAAAAAPbHBfdG9rZW5fc3ltYm9sAAAAABAAAAAAAAAAFG1hcmdpbl9yYXRpb19pbml0aWFsAAAABAAAAAAAAAAYbWFyZ2luX3JhdGlvX21haW50ZW5hbmNlAAAABAAAAAAAAAAEbmFtZQAAABAAAAAAAAAABm9yYWNsZQAAAAAAEwAAAAAAAAANb3JhY2xlX3NvdXJjZQAAAAAAB9AAAAAMT3JhY2xlU291cmNlAAAAAAAAAARwb29sAAAH0AAAAApQb29sUGFyYW1zAAAAAAAAAAAAC3F1b3RlX3Rva2VuAAAAABMAAAAAAAAAEnF1b3RlX3Rva2VuX3N5bWJvbAAAAAAAEAAAAAAAAAAZc3ludGhfdGFyZ2V0X3Rva2VuX3N5bWJvbAAAAAAAABAAAAAAAAAAEHN5bnRoX3Rva2VuX25hbWUAAAAQAAAAAAAAABJzeW50aF90b2tlbl9zeW1ib2wAAAAAABAAAAAAAAAABHRpZXIAAAfQAAAACVN5bnRoVGllcgAAAAAAAAAAAAAOdG9rZW5fZGVjaW1hbHMAAAAAAAQ=",
        "AAAAAQAAAG5UaGlzIHN0cnVjdCBpcyB1c2VkIHRvIHJldHVybiBhIHF1ZXJ5IHJlc3VsdCB3aXRoIHRoZSB0b3RhbCBhbW91bnQgb2YgTFAgdG9rZW5zIGFuZCBhc3NldHMgaW4gYSBzcGVjaWZpYyBwb29sLgAAAAAAAAAAAA5NYXJrZXRSZXNwb25zZQAAAAAAAQAAAAAAAAAEbmFtZQAAABA=",
        "AAAAAQAAAAAAAAAAAAAACk1hcmtldEluZm8AAAAAAAIAAAAAAAAADm1hcmtldF9hZGRyZXNzAAAAAAATAAAAAAAAAA9tYXJrZXRfcmVzcG9uc2UAAAAH0AAAAA5NYXJrZXRSZXNwb25zZQAA",
        "AAAAAgAAAAAAAAAAAAAADk9yZGVyRGlyZWN0aW9uAAAAAAACAAAAAAAAAAAAAAADQnV5AAAAAAAAAAAAAAAABFNlbGw=",
        "AAAAAQAAAAAAAAAAAAAAClBvb2xQYXJhbXMAAAAAAAgAAAAAAAAACGZlZV9yYXRlAAAABwAAAAAAAAASaW5pdGlhbF9zcXJ0X3ByaWNlAAAAAAAKAAAAAAAAABhtYXhfYWxsb3dlZF9zbGlwcGFnZV9icHMAAAAHAAAAAAAAABhtYXhfYWxsb3dlZF92YXJpYW5jZV9icHMAAAAHAAAAAAAAAAZvcmFjbGUAAAAAABMAAAAAAAAADW9yYWNsZV9zb3VyY2UAAAAAAAfQAAAADE9yYWNsZVNvdXJjZQAAAAAAAAARcHJvdG9jb2xfZmVlX3JhdGUAAAAAAAAHAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAE" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        create_market: this.txFromJSON<string>,
        update_super_keepers: this.txFromJSON<null>,
        update_wasm_hashes: this.txFromJSON<null>,
        update_oracle_guard_rails: this.txFromJSON<null>,
        query_markets: this.txFromJSON<Array<string>>,
        query_market_details: this.txFromJSON<MarketInfo>,
        query_all_markets_details: this.txFromJSON<Array<MarketInfo>>,
        query_for_market_by_token_pair: this.txFromJSON<string>,
        get_admin: this.txFromJSON<string>,
        get_config: this.txFromJSON<MarketFactoryConfig>,
        update: this.txFromJSON<null>
  }
}