import type { NavSectionProps } from '@/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from '@/global-config';

import { SvgColor } from '@/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

// TODO: update icons
const ICONS = {
  dashboard: icon('ic-dashboard'),
  external: icon('ic-external'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: '',
    items: [
      {
        title: 'Overview',
        caption: '',
        path: paths.overview,
        icon: ICONS.dashboard,
      },
      {
        title: 'Trade',
        path: '',
        icon: ICONS.dashboard,
        children: [
          { title: 'Synths', path: paths.markets.root },
          { title: 'Indexes', path: paths.index.root },
        ],
      },
      {
        title: 'Earn',
        path: '',
        icon: ICONS.dashboard,
        children: [
          { title: 'Yield', path: paths.markets.root },
          { title: 'LP', path: paths.index.root },
          { title: 'Insurance', path: paths.insurance },
        ],
      },
      {
        title: 'Rewards',
        path: '',
        icon: ICONS.dashboard,
        children: [
          { title: 'NORM', path: paths.governance.root },
          { title: 'Referrals', path: paths.rewards },
        ],
      },
      {
        title: 'Analytics',
        path: paths.analytics,
        icon: ICONS.dashboard,
      },
      {
        title: 'More',
        path: '',
        icon: ICONS.dashboard,
        children: [
          {
            title: 'Governance',
            path: 'https://www.google.com/',
            icon: ICONS.external,
          },
          {
            title: 'Help & Feedback',
            path: 'https://www.google.com/',
            icon: ICONS.external,
          },
          {
            title: 'Docs',
            path: paths.docs,
            icon: ICONS.external,
          },
        ],
      },
    ],
  },
];
