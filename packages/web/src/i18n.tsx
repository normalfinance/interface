/* eslint-disable consistent-return */

'use client';

import { useEffect, ReactNode, createContext, useMemo, useContext, useCallback } from 'react';

import i18n, { t } from 'i18next';
import {
  Trans as OGTrans,
  Translation,
  initReactI18next,
  useTranslation as useTranslationOG,
} from 'react-i18next';

import { SupportedLocale } from '@/constants/locales';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useLocalStorage } from 'usehooks-ts';
import { useSettingsContext } from './components/settings';

export { t } from 'i18next';

export const Trans = ((props) => {
  // forces re-render on language change because it doesn't by default
  useTranslation();
  return <OGTrans {...props}>{props.children}</OGTrans>;
}) satisfies typeof OGTrans;

export function useTranslation() {
  if (process.env.VERCEL_ENV === 'test') {
    return { i18n, t };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useTranslationOG();
}

export function Plural({ value, one, other }: { value: number; one: string; other: string }) {
  const children = value === 1 ? one : other;
  if (process.env.VERCEL_ENV === 'test') {
    return <>{children}</>;
  }
  // ensures it re-renders when language changes
  return <Translation>{() => children}</Translation>;
}

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

let changingTo = '';

export async function dynamicActivate(locale: SupportedLocale) {
  if (i18n.language === locale || locale === changingTo) return;
  // since its async we need to "lock" while its changing
  changingTo = locale;
  await i18n.changeLanguage(locale);
  i18n.emit('');
  changingTo = '';
}

// dynamicActivate('en-US'); // initialLocale

export type ContextType = {
  currentLocale: SupportedLocale;
  onChangeLang: (newLang: SupportedLocale) => void;
};

export const LanguageContext = createContext({} as ContextType);

export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const settings = useSettingsContext();

  const [currentLocale, setCurrentLocale] = useLocalStorage('i18nextLng', 'en-US', {
    initializeWithValue: false,
  });

  const onChangeLang = useCallback((newLang: SupportedLocale) => {
    dynamicActivate(newLang);
    document.documentElement.setAttribute('lang', newLang);
    settings.onChangeDirectionByLang(newLang);
    setCurrentLocale(newLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChangeLang(currentLocale);
  }, [currentLocale, onChangeLang]);

  const memoizedValue = useMemo(
    () => ({
      currentLocale,
      onChangeLang,
    }),
    [currentLocale, onChangeLang]
  );

  return <LanguageContext.Provider value={memoizedValue}>{children}</LanguageContext.Provider>;
}

export const useLocales = () => {
  const context = useContext(LanguageContext);

  if (!context) throw new Error('useLocales context must be use inside LanguageProvider');

  return context;
};
