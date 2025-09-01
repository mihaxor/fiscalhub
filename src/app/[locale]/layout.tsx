import React from 'react';
import type {Metadata, Viewport} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import DarkVeil from '@/shared/components/DarkVeil';
import {TranslationsProvider} from '@/shared/providers/TranslationsProvider';
import {Providers} from '@/app/[locale]/provider';
import i18nConfig, {LanguageType} from '@/config/i18n';
import {dir} from 'i18next';
import initTranslations from '@/app/i18n';
import '@/app/globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1.0,
    userScalable: false
}

export const metadata: Metadata = {
    title: 'Fiscal Hub',
    description: 'Fiscal calculator for salaries, micro-enterprises, LLCs, dividends, and social contributions.'
};

export function generateStaticParams() {
    return i18nConfig.locales.map(locale => ({locale}));
}

type RootLayoutProps = Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>
}>

const RootLayout = async ({children, params}: RootLayoutProps) => {
    const {locale} = await params;
    const {resources} = await initTranslations(locale as LanguageType);

    return (
        <html lang={locale} dir={dir(locale)} data-scroll-behavior='smooth' suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <Providers>
            <TranslationsProvider
                locale={locale as LanguageType}
                resources={resources}>
                <DarkVeil />
                {children}
            </TranslationsProvider>
        </Providers>

        </body>
        </html>
    );
}

export default RootLayout;