import type { Metadata } from "next";
import localFont from "next/font/local";
import { locales } from '@/config/locales';
import "../globals.css";
import { notFound } from 'next/navigation';
import { IntlProvider } from '@/lib/IntlProvider';

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Syntropedia - Open Knowledge Encyclopedia on Syntropic Agriculture",
  description: "Discover, share, and learn about plant species for regenerative agroforestry systems",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getMessages(locale: string) {
  if (locale === 'en') {
    return (await import('../../../messages/en.json')).default
  } else if (locale === 'es') {
    return (await import('../../../messages/es.json')).default
  } else {
    return (await import('../../../messages/pt-BR.json')).default
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IntlProvider messages={messages} locale={locale}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
