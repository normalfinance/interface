import type { BoxProps } from '@mui/material/Box';

import { useState } from 'react';
import { paths } from '@/routes/paths';
import { Iconify } from '@/components/iconify';
import { varAlpha } from 'minimal-shared/utils';
import { Scrollbar } from '@/components/scrollbar';
import { MotionViewport } from '@/components/animate';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Card, Button, CardHeader, Typography, ListItemText } from '@mui/material';

import { SectionTitle } from './components/section-title';

// ----------------------------------------------------------------------

const QUESTS = [
  {
    id: '0',
    title: 'Follow @normalfi on Twitter',
    description: '',
    reward: '',
    action: paths.socials.twitter,
  },
  {
    id: '1',
    title: 'Join our Discord',
    description: '',
    reward: '',
    action: paths.socials.discord,
  },
  {
    id: '2',
    title: 'Share Normal on Twitter',
    description: '',
    reward: '',
    action: 'https://twitter.com/intent/tweet?text=Your%20custom%20message%20here',
  },
  {
    id: '3',
    title: 'Commit to providing liquidity',
    description: '',
    reward: '',
    action: '',
  },
];

// ----------------------------------------------------------------------

export function HomeQuests({ sx, ...other }: BoxProps) {
  const [selected, setSelected] = useState(['2']);

  const handleClickComplete = (taskId: string) => {
    const tasksCompleted = selected.includes(taskId)
      ? selected.filter((value) => value !== taskId)
      : [...selected, taskId];

    setSelected(tasksCompleted);
  };

  return (
    <Box component="section" sx={sx} {...other}>
      <MotionViewport sx={{ py: 10, position: 'relative' }}>
        <Container>
          <SectionTitle
            title="Join the action"
            txtGradient="now!"
            sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center' }}
          />

          <Card sx={sx}>
            <CardHeader title="Quests" subheader="Complete quests to earn rewards" sx={{ mb: 1 }} />

            <Scrollbar sx={{ minHeight: 304 }}>
              {/* <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} sx={{ minWidth: 560 }}> */}
              <Box
                sx={{
                  p: 3,
                  gap: 3,
                  minWidth: 360,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {QUESTS.map((item) => (
                  <TaskItem
                    key={item.id}
                    item={item}
                    selected={selected.includes(item.id)}
                    onChange={() => handleClickComplete(item.id)}
                  />
                ))}
              </Box>
              {/* </Stack> */}
            </Scrollbar>
          </Card>
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TaskItemProps = BoxProps & {
  selected: boolean;
  item: any; // Props['list'][number];
  onChange: (id: string) => void;
};

function TaskItem({ item, selected, onChange, sx, ...other }: TaskItemProps) {
  return (
    <>
      <Box
        sx={[{ gap: 2, display: 'flex', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        <Box
          sx={[
            (theme) => ({
              width: 40,
              height: 40,
              display: 'flex',
              borderRadius: '50%',
              alignItems: 'center',
              color: 'primary.main',
              justifyContent: 'center',
              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
              ...(item.id === '1' && {
                color: 'info.main',
                bgcolor: varAlpha(theme.vars.palette.info.mainChannel, 0.08),
              }),
              ...(item.id === '2' && {
                color: 'error.main',
                bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
              }),
            }),
          ]}
        >
          <Iconify width={24} icon="solar:cup-star-bold" />
        </Box>

        <ListItemText
          primary={<Typography variant="subtitle2">{item.title}</Typography>}
          secondary={
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {item.description}
            </Typography>
          }
          slotProps={{
            primary: { noWrap: true },
            secondary: {
              noWrap: true,
              sx: { mt: 0.5 },
            },
          }}
        />

        <Button
          variant="contained"
          color="info"
          size="small"
          onClick={item.action}
          startIcon={<Iconify icon="mingcute:sword-fill" />}
        >
          Complete
        </Button>

        {/* <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}
      </Box>

      {/* <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={handleMarkComplete}>
            <Iconify icon="eva:checkmark-circle-2-fill" />
            Mark complete
          </MenuItem>

          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleShare}>
            <Iconify icon="solar:share-bold" />
            Share
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover> */}
    </>
  );
}
