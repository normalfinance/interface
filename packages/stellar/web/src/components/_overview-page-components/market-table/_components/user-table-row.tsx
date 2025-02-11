'use client';

import type { IUserItem } from 'src/types/user';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';

type Props = {
  row: IUserItem;
  selected: boolean;
  editHref: string;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function UserTableRow({ row, selected, editHref, onSelectRow, onDeleteRow }: Props) {
  const theme = useTheme();

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        sx={{ cursor: 'pointer' }}
      >
        {/* Remove the checkbox cell. If you need to preserve column count,
            you could add an empty cell with sx={{ display: 'none' }} */}
        <TableCell padding="checkbox" sx={{ display: 'none' }} />

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.name} src={row.avatarUrl} />
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={editHref}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phoneNumber}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.company}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.role}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'pending' && 'warning') ||
              (row.status === 'banned' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            <Icon
              icon="mdi:keyboard-arrow-right"
              width="24"
              height="24"
              style={{ color: theme.palette.grey[600] }}
            />
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}
