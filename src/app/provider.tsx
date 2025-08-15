'use client'

import {HeroUIProvider} from '@heroui/react'
import React from 'react';
import {ThemeProvider} from 'next-theme';
import {RatesProvider} from '@/shared/hooks/useRates';

export const Providers = ({children}: { children: React.ReactNode }) => (
    <ThemeProvider attribute='class'>
        <HeroUIProvider>
            <RatesProvider>
                {children}
            </RatesProvider>
        </HeroUIProvider>
    </ThemeProvider>
);