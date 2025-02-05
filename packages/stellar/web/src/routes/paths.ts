import { kebabCase } from 'es-toolkit';

// ----------------------------------------------------------------------

export const paths = {
  page404: '/error/404',
  page500: '/error/500',
  docs: 'https://docs.normalfinance.io',
  overview: '/overview',
  markets: {
    root: '/markets',
    details: (title: string) => `/markets/${kebabCase(title)}`,
  },
  index: {
    root: '/index',
    details: (title: string) => `/index/${kebabCase(title)}`,
    create: '/index/create',
  },
  insurance: '/insurance',
  rewards: '/rewards',
  analytics: '/analytics',
  governance: {
    root: '/governance',
    proposals: {
      root: '/governance/proposals',
      details: (id: string) => `/governance/proposals/${kebabCase(id)}`,
    },
    lock: '/governance/lock',
    liquidityVoting: '/governance/vote',
  },
};
