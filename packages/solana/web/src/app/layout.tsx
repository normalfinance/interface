import type { Metadata } from 'next';

// locales
import { LanguageProvider } from '@/i18n';

// theme
import { NormalThemeProvider, primaryFont } from '@normalfinance/ui';

// providers
import { ExternalProvider } from '@/providers/ExternalProvider';
import { SettingsProvider } from '@/components/settings';
import LocalizationProvider from '@/providers/LocalizationProvider';

export const metadata: Metadata = {
  title: 'Normal',
  description: '',
  keywords: 'crypto, investing, crypto index, defi',
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <LocalizationProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light',
              themeDirection: 'ltr',
              themeLayout: 'vertical',
            }}
          >
            <LanguageProvider>
              <ExternalProvider>
                <NormalThemeProvider>{children}</NormalThemeProvider>
              </ExternalProvider>
            </LanguageProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
