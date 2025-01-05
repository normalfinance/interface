import { useState, useCallback } from 'react';
import { Button, Card, Tab, Tabs, Typography } from '@mui/material';
import { Trans } from '@/i18n';

// ----------------------------------------------------------------------

type Props = {
  onNext: () => void;
};

const TABS = [
  {
    value: 'full',
    label: 'Full Range',
    description: (
      <Trans>
        Providing full range liquidity ensures continuous market participation across all possible
        prices, offering simplicity but with potential for higher impermanent loss.
      </Trans>
    ),
  },
  {
    value: 'custom',
    label: 'Custom Range',
    description: (
      <Trans>
        Custom range allows you to concentrate your liquidity within specific price bounds,
        enhancing capital efficiency and fee earnings but requiring more active management.
      </Trans>
    ),
  },
];

export default function CreateLiquidityPositionStepTwo({ onNext }: Props) {
  const [currentTab, setCurrentTab] = useState('full');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Card>
      <Typography variant="h6">
        <Trans>Set price range</Trans>
      </Typography>

      <Tabs value={currentTab} onChange={handleChangeTab}>
        {TABS.map((tab) => (
          <>
            <Tab key={tab.value} value={tab.value} label={tab.label} />

            <Typography variant="caption2">{tab.description}</Typography>
          </>
        ))}
      </Tabs>

      {/* TODO: price selector */}

      <Button onClick={onNext}>Continue</Button>
    </Card>
  );
}
