// routes
import { paths } from '@/routes/paths';
// locales
import { Trans } from '@/i18n';
// components
import SvgColor from '@/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  home: icon('ic_home'),
  indexes: icon('ic_indexes'),
  education: icon('ic_education'),
  lending: icon('ic_lending'),
  orders: icon('ic_orders'),
  referrals: icon('ic_user'),
  portfolio: icon('ic_chart'),
  external: icon('ic_external'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  return [
    {
      subheader: '',
      items: [
        {
          title: <Trans>Overview</Trans>,
          caption: 'testing',
          path: paths.home,
          icon: ICONS.home,
        },
        {
          title: <Trans>Trade</Trans>,
          path: paths.markets,
          icon: ICONS.portfolio,
          children: [
            { title: <Trans>Markets</Trans>, path: paths.markets },
            { title: <Trans>Indexes</Trans>, path: paths.indexes },
          ],
        },
        {
          title: <Trans>Earn</Trans>,
          path: paths.indexes,
          icon: ICONS.indexes,
          children: [
            { title: <Trans>Yield</Trans>, path: paths.markets },
            { title: <Trans>LP</Trans>, path: paths.indexes },
            { title: <Trans>Insurance</Trans>, path: paths.indexes },
          ],
        },
        {
          title: <Trans>Rewards</Trans>,
          path: paths.indexes,
          icon: ICONS.indexes,
          children: [
            { title: <Trans>NORM</Trans>, path: paths.markets },
            { title: <Trans>Referrals</Trans>, path: paths.indexes },
          ],
        },
        {
          title: <Trans>Analytics</Trans>,
          path: paths.insuranceFund,
          icon: ICONS.indexes,
        },
        {
          title: <Trans>More</Trans>,
          path: paths.indexes,
          icon: ICONS.indexes,
          children: [
            {
              title: <Trans>Governance</Trans>,
              path: 'https://www.google.com/',
              icon: ICONS.external,
            },
            {
              title: <Trans>Help & Feedback</Trans>,
              path: 'https://www.google.com/',
              icon: ICONS.external,
            },
            {
              title: <Trans>Docs</Trans>,
              path: 'https://www.google.com/',
              icon: ICONS.external,
            },
          ],
        },
      ],
    },
  ];
}
