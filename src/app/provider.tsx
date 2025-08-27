'use client'

import {HeroUIProvider} from '@heroui/react'
import React, {useEffect} from 'react';
import {ThemeProvider} from 'next-themes';
import {RatesProvider} from '@/shared/store/useRatesStore';

export const Providers = ({children}: { children: React.ReactNode }) => {

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'instant'});

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    return (
        <ThemeProvider attribute='class' defaultTheme='dark'>
            <HeroUIProvider className='flex justify-center mx-5'>
                <RatesProvider>
                    {children}
                </RatesProvider>
            </HeroUIProvider>
        </ThemeProvider>
    );
}