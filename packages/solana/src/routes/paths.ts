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
  insurance: '/insurance',
  rewards: '/rewards',
  analytics: '/analytics',
};
