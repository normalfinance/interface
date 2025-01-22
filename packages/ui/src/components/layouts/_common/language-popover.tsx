import { useCallback } from 'react';
import { m } from 'framer-motion';
// import i18n from 'i18next';
// @mui
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from '@/components/template/iconify';
import { varHover } from '@/components/template/animate';
import CustomPopover, { usePopover } from '@/components/template/custom-popover';
// analytics
import {
  LOCALE_ICON,
  LOCALE_LABEL,
  SUPPORTED_LOCALES,
  SupportedLocale,
  useLocales,
} from '@normalfinance/ui';
import Scrollbar from '@/components/template/scrollbar';
// import { trackClientEvent } from '@/utils/analytics/client';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const popover = usePopover();

  const { currentLocale, onChangeLang } = useLocales();

  const handleChangeLang = useCallback(
    (newLocale: SupportedLocale) => {
      onChangeLang(newLocale);
      popover.onClose();
      // trackClientEvent('Changed Locale', { from: i18n.language, to: newLocale });
    },
    [onChangeLang, popover]
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Iconify icon={LOCALE_ICON[currentLocale]} sx={{ borderRadius: 0.65, width: 28 }} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        <Scrollbar>
          {SUPPORTED_LOCALES.map((option) => (
            <MenuItem
              key={option}
              selected={option === currentLocale}
              onClick={() => handleChangeLang(option)}
            >
              <Iconify icon={LOCALE_ICON[option]} sx={{ borderRadius: 0.65, width: 28 }} />

              {LOCALE_LABEL[option]}
            </MenuItem>
          ))}
        </Scrollbar>
      </CustomPopover>
    </>
  );
}
