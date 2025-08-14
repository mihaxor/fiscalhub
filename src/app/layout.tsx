import React from 'react';
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
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

export const metadata: Metadata = {
    title: 'Fiscal hub',
    description: 'Fiscal calculator for salaries, micro-enterprises, LLCs, dividends, and social contributions.',
};

const RootLayout = ({children}: Readonly<{ children: React.ReactNode; }>) => (
    <html lang='en' className='dark'>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <Providers>
        {children}
    </Providers>
    </body>
    </html>
);

export default RootLayout;