'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';
import {RateType} from '@/shared/hooks/fiscal.types';

const RatesContext = createContext({
    data: {} as Record<RateType, number> | undefined,
    isLoading: true,
    isError: false,
    error: null,
    reFetch: () => {
    }
});

export const RatesProvider = ({children}: { children: React.ReactNode }) => {
    const [data, setData] = useState<Record<RateType, number> | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reFetch, setReFetch] = useState(false);

    const getRates = async () => {
        setLoading(true);

        const data = await fetch('/api/rates')
            .then(res => res.json())
            .catch(err => {
                console.error('Error fetching rates:', err);
                setError(err);
            })
            .finally(() => setLoading(false));

        setData(data);
    }

    useEffect(() => {
        getRates();
    }, [reFetch]);

    return (
        <RatesContext.Provider
            value={{
                data,
                isLoading: loading,
                isError: !!error,
                error,
                reFetch: () => setReFetch(!reFetch)
            }}>
            {children}
        </RatesContext.Provider>
    );
}

export const useRatesStore = () => useContext(RatesContext);