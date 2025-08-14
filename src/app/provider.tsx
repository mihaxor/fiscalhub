'use client'

import {HeroUIProvider} from '@heroui/react'
import React from 'react';
import {ThemeProvider} from 'next-theme';

export const Providers = ({children}: { children: React.ReactNode }) => (
    <ThemeProvider attribute='class' defaultTheme='dark'>
        <HeroUIProvider>
            {children}
        </HeroUIProvider>
    </ThemeProvider>
);