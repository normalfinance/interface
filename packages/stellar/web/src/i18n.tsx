/* eslint-disable consistent-return */

'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export { t } from 'i18next';

i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      // not sure why but it tries to load es THEN es-ES, for any language, but we just want the second
      if (!language.includes('-')) {
        return;
      }
      if (language === 'en-US') {
        if (process.env.VERCEL_ENV === 'test') {
          return import('./i18n/locales/source/en-US.json');
        }
      }
      return import(`./i18n/locales/${namespace}/${language}.json`);
    })
  )
  .on('failedLoading', (language, namespace, msg) => {
    console.error(`Error loading language ${language} ${namespace}: ${msg}`);
  });

i18n
  .init({
    returnEmptyString: false,
    ns: 'translations',
    defaultNS: 'translations',
    keySeparator: '~~',
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      transSupportBasicHtmlNodes: true,
    },
  })
  .catch(() => undefined);
