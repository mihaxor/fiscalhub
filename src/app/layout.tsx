import React from 'react';
import type {Metadata, Viewport} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import DarkVeil from '@/shared/components/DarkVeil';
import {Providers} from '@/app/provider';
import './globals.css';

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

const RootLayout = ({children}: Readonly<{ children: React.ReactNode; }>) =>
    <html lang='en' className={process.env.NEXT_PUBLIC_APP_THEME} suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

    <DarkVeil />
    <Providers>
        {children}
    </Providers>

    </body>
    </html>

export default RootLayout;