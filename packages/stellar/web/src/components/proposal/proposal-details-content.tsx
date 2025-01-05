// @mui
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// types
import { IJobItem } from 'src/types/job';
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import ProposalVotes from './proposal-votes';
import { Button, LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  proposal: IJobItem;
};

export default function ProposalDetailsContent({ proposal }: Props) {
  const {
    title,
    skills,
    salary,
    content,
    benefits,
    createdAt,
    experience,
    expiredDate,
    employmentTypes,
  } = proposal;

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">{title}</Typography>

      <Markdown children={content} />

      <Stack spacing={2}>
        <Typography variant="h6">Skills</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {skills.map((skill) => (
            <Chip key={skill} label={skill} variant="soft" />
          ))}
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Benefits</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {benefits.map((benefit) => (
            <Chip key={benefit} label={benefit} variant="soft" />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderCastVote = (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={2}
      direction="row"
      sx={{ p: 3, borderRadius: 2, mt: 3 }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle1">
          <Trans>Cast your vote</Trans>
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <Button
          fullWidth
          variant="contained"
          color="info"
          startIcon={<Iconify icon="solar:shield-check-bold" />}
          onClick={() => {}}
        >
          For
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Iconify icon="solar:close-circle-bold" />}
          onClick={() => {}}
        >
          Against
        </Button>
      </Stack>
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: 'Voting',
          value: fDate(createdAt),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Expiration date',
          value: fDate(expiredDate),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Employment type',
          value: employmentTypes,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Offered salary',
          value: salary.negotiable ? 'Negotiable' : fCurrency(salary.price),
          icon: <Iconify icon="solar:wad-of-money-bold" />,
        },
        {
          label: 'Experience',
          value: experience,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Stack>
  );

  const renderCurrentResult = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">
        <Trans>Current result</Trans>
      </Typography>

      <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
        <ProgressItem key={'yay'} progress={{}} />
        <ProgressItem key={'nay'} progress={{}} />
      </Stack>
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderCastVote}

        {renderOverview}

        {renderCurrentResult}

        <ProposalVotes />
      </Grid>
    </Grid>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  label: string;
  value: number;
  totalAmount: number;
};

type ProgressItemProps = {
  progress: ItemProps;
};

function ProgressItem({ progress }: ProgressItemProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>

        <Typography variant="subtitle2">{fCurrency(progress.totalAmount)}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={
          (progress.label === 'Total Income' && 'info') ||
          (progress.label === 'Total Expenses' && 'warning') ||
          'primary'
        }
      />
    </Stack>
  );
}
