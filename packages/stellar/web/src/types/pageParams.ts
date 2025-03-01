export type SwapPageParams = {
  swapSellTokenParam?: string;
  swapBuyTokenParam?: string;
  swapAmountParam?: string;
};

export type SendPageParams = {
  sendTokenParam?: string; // > Token
  sendAmountParam?: string;
  sendDestinationParam?: string;
};

export type OverviewPageParams = {
  swap: SwapPageParams;
  send: SendPageParams;
};
