'use client';

// @mui
import { alpha } from '@mui/material/styles';
//
import { IconButton, Stack, Typography } from '@mui/material';
import Iconify from '@/components/iconify';
import { Trans } from '@/i18n';

// ----------------------------------------------------------------------

const socials = [
  {
    value: 'twitter',
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    color: '#00AAEC',
    path: '',
  },
  {
    value: 'discord',
    name: 'Discord',
    icon: 'ant-design:discord-filled',
    color: '#5865F2',
    path: '',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    icon: 'ant-design:instagram-filled',
    color: '#E02D69',
    path: 'https://www.instagram.com/@normalfinance.io',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    icon: 'eva:linkedin-fill',
    color: '#007EBB',
    path: 'https://www.linkedin.com/company/normalfi/',
  },
  {
    value: 'github',
    name: 'Github',
    icon: 'eva:github-fill',
    color: '#171515',
    path: '',
  },
];

export default function Footer() {
  const renderSocialIcons = (
    <Stack spacing={1} alignItems="center" justifyContent="center" direction="row">
      {socials.map((social) => (
        <IconButton
          key={social.name}
          href={social.path}
          sx={{
            color: social.color,
            '&:hover': {
              bgcolor: alpha(social.color, 0.08),
            },
          }}
        >
          <Iconify icon={social.icon} />
        </IconButton>
      ))}
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent="space-between" sx={{ pt: 8, pb: 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="start">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <Trans>Made with ❤️ from the USA</Trans>
        </Typography>
      </Stack>

      {renderSocialIcons}

      <Stack direction="row" alignItems="center" justifyContent="end">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          © 2024 Normal Finance, Inc.
        </Typography>
      </Stack>
    </Stack>
  );
}
