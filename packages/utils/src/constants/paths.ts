export const paths = {
  page404: '/404',
  page500: '/500',

  home: '/',

  positions: '/positions',

  // Markets
  markets: {
    root: '/markets',
    byId: (id: number) => `/market/${encodeURIComponent(id)}`,
  },

  // Indexes
  indexes: {
    root: '/indexes',
    byId: (id: number) => `/indexes/${encodeURIComponent(id)}`,
    create: '/indexes/create',
  },

  insuranceFund: '/insurance-fund',

  rewards: '/rewards',

  // Governance
  governance: {
    root: '/governance',
    proposals: '/governance/proposal',
    stake: '/governance/stake',
  },

  // Analytics
  analytics: {
    root: '/analytics',
    liquidations: '/analytics/liquidations',
    bankruptcies: '/analytics/bankruptcies',
  },
};
