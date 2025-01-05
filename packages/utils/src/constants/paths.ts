export const paths = {
  page404: '/404',
  page500: '/500',

  home: '/',

  positions: '/positions',

  // Markets
  markets: '/markets',
  marketById: (id: number) => `/market/${encodeURIComponent(id)}`,

  // Indexes
  indexes: '/indexes',
  indexById: (id: number) => `/indexes/${encodeURIComponent(id)}`,
  createIndex: '/create-index',

  insuranceFund: '/insurance-fund',
};
