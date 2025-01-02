export const ANALYTICS_ENABLED = Boolean(process.env.ANALYTICS_ENABLED) ?? false;

export const CUSTOMER_IO = {
  siteId: process.env.CUSTOMER_IO_SITE_ID ?? '',
  apiKey: process.env.CUSTOMER_IO_API_KEY ?? '',
  appApiKey: process.env.CUSTOMER_IO_APP_API_KEY ?? '',
};

export const FILLOUT = {
  feedbackFormId: 'u1ho1igvpPus',
  requestAssetFormId: '6Cqt7SSdNrus',
};

export const CRISP = {
  websiteId: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? '',
  secretKey: process.env.CRISP_SECRET_KEY ?? '',
};

export const URLS = {
  blog: {
    indexes: <Record<number, string>>{
      1: 'https://blog.normalfinance.io/normal-crypto-index/',
      2: 'https://blog.normalfinance.io/normal-top-5-index/',
      3: 'https://blog.normalfinance.io/normal-top-10-index/',
      4: 'https://blog.normalfinance.io/normal-top-15-index/',
      5: 'https://blog.normalfinance.io/normal-layer-1-index/',
      6: 'https://blog.normalfinance.io/normal-layer-2-index/',
      7: 'https://blog.normalfinance.io/normal-ai-data-index/',
      8: 'https://blog.normalfinance.io/normal-gamefi-index/',
      9: 'https://blog.normalfinance.io/normal-web3-nft-index/',
      10: 'https://blog.normalfinance.io/normal-defi-index/',
      36: 'https://blog.normalfinance.io/normal-rwa-index/',
      38: 'https://blog.normalfinance.io/normal-depin-index/',
      39: 'https://blog.normalfinance.io/normal-meme-index/',
    },
  },
};
