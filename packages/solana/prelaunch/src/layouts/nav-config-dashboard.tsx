import type { NavSectionProps } from '@/components/nav-section';

import { CONFIG } from '@/global-config';
import { SvgColor } from '@/components/svg-color';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

// TODO: update icons
const ICONS = {
  home: icon('ic-home'),
  external: icon('ic-external'),
  insurance: icon('mingcute-insurance'),
  referrals: icon('mingcute-referrals'),
  analytics: icon('mingcute-analytics'),
  rewards: icon('mingcute-rewards'),
  lp: icon('mingcute-lp'),
  yield: icon('mingcute-yield'),
  more: icon('mingcute-more'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  {
    subheader: '',
    items: [
      {
        title: 'Overview',
        caption: '/',
        path: paths.root,
        icon: ICONS.home,
      },
      {
        title: 'Trade',
        path: '#',
        children: [
          { title: 'Synths', path: paths.markets.root },
          { title: 'Indexes', path: paths.indexes.root },
        ],
      },
      {
        title: 'Earn',
        path: '#',
        children: [
          { title: 'Yield', path: paths.markets.root, icon: ICONS.yield },
          { title: 'LP', path: paths.markets.root, icon: ICONS.lp },
          { title: 'Insurance', path: paths.insurance, icon: ICONS.insurance },
        ],
      },
      {
        title: 'Rewards',
        path: '#',
        // icon: ICONS.rewards,
        children: [{ title: 'Referrals', path: paths.rewards, icon: ICONS.referrals }],
      },
      {
        title: 'Analytics',
        path: paths.analytics,
        icon: ICONS.analytics,
      },
      {
        title: 'More',
        path: '#',
        // icon: ICONS.more,
        children: [
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
