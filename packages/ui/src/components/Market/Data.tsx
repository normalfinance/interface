import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
//
import { PositionTab, TradesTab, AccountTab } from './Tabs';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'position',
    label: 'Position',
  },
  {
    value: 'trades',
    label: 'Trades',
  },
  {
    value: 'account',
    label: 'Account',
  },
];

// ----------------------------------------------------------------------

const HighlightedIndex = ({ title, index, sx, ...other }: Props) => {
  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'position' && <PositionTab />}

      {currentTab === 'trades' && <TradesTab />}

      {currentTab === 'account' && <AccountTab />}
    </>
  );
};
