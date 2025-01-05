export const ANALYTICS_ENABLED = Boolean(process.env.ANALYTICS_ENABLED) ?? false;

export const CUSTOMER_IO = {
  siteId: process.env.CUSTOMER_IO_SITE_ID ?? '',
  apiKey: process.env.CUSTOMER_IO_API_KEY ?? '',
  appApiKey: process.env.CUSTOMER_IO_APP_API_KEY ?? '',
};

export const CRISP = {
  websiteId: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? '',
  secretKey: process.env.CRISP_SECRET_KEY ?? '',
};
