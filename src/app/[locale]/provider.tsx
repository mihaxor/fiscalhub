'use client'

import {HeroUIProvider} from '@heroui/react';
import {ToastProvider} from '@heroui/toast';
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
                <ToastProvider
                    placement='top-right'
                    toastProps={{
                        radius: 'md',
                        variant: 'bordered',
                        timeout: 3500,
                        hideIcon: false
                    }}
                />
                <RatesProvider>
                    {children}
                </RatesProvider>
            </HeroUIProvider>
        </ThemeProvider>
    );
}