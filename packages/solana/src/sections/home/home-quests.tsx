import type { BoxProps } from '@mui/material/Box';

import { MotionViewport } from '@/components/animate';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

const QUESTS = [
  {
    title: 'How can I get the update?',
    description: '',
    reward: '',
    action: '',
  },
];

// ----------------------------------------------------------------------

export function HomeQuests({ sx, ...other }: BoxProps) {
  return (
    <Box component="section" sx={sx} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        <Container>
          <h1>hello</h1>
        </Container>
      </MotionViewport>
    </Box>
  );
}
