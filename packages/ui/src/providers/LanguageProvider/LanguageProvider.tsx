import { useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { dynamicActivate } from './DynamicActivate';
import { useSettingsContext } from '../SettingsProvider';

export type ContextType = {
  currentLocale: SupportedLocale;
  onChangeLang: (newLang: SupportedLocale) => void;
};

export const LanguageContext = createContext({} as ContextType);

export function LanguageProvider({ children }: { children: React.ReactNode }): JSX.Element {
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
