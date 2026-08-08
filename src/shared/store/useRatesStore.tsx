'use client';

import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {RateType} from '@/shared/hooks/fiscal.types';

type Rates = Record<RateType, number>;

interface RatesContextValue {
    data: Rates | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    reFetch: () => void;
}

interface RatesErrorResponse {
    error: string;
}

const RatesContext = createContext<RatesContextValue | undefined>(undefined);

const isRatesResponse = (value: unknown): value is Rates => {
    if (!value || typeof value !== 'object') return false;

    const rates = value as Partial<Record<RateType, unknown>>;
    return ['EUR', 'USD', 'GBP'].every(currency =>
        typeof rates[currency as RateType] === 'number'
    );
}

const isRatesErrorResponse = (value: unknown): value is RatesErrorResponse =>
    !!value && typeof value === 'object' &&
    'error' in value && typeof value.error === 'string';

const normalizeError = (error: unknown): Error =>
    error instanceof Error ? error : new Error('Unknown rates error.');

export const RatesProvider = ({children}: { children: React.ReactNode }) => {
    const [data, setData] = useState<Rates | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [requestVersion, setRequestVersion] = useState(0);

    useEffect(() => {
        let isActive = true;

        const getRates = async () => {
            try {
                const response = await fetch('/api/rates');
                const payload: unknown = await response.json();

                if (!response.ok) {
                    const message = isRatesErrorResponse(payload)
                        ? payload.error
                        : `Rates request failed with status ${response.status}.`;

                    throw new Error(message);
                }

                if (!isRatesResponse(payload)) throw new Error('Rates response is invalid.');

                if (isActive) {
                    setData(payload);
                    setError(null);
                }
            } catch (error: unknown) {
                const normalizedError = normalizeError(error);

                console.warn('Rates unavailable:', normalizedError.message);

                if (isActive) {
                    setData(undefined);
                    setError(normalizedError);
                }
            } finally {
                if (isActive) setLoading(false);
            }
        };

        void getRates();

        return () => {
            isActive = false;
        };
    }, [requestVersion]);

    const reFetch = useCallback(() => {
        setData(undefined);
        setError(null);
        setLoading(true);
        setRequestVersion(version => version + 1);
    }, []);

    return (
        <RatesContext.Provider
            value={{
                data,
                isLoading: loading,
                isError: !!error,
                error,
                reFetch
            }}>
            {children}
        </RatesContext.Provider>
    );
}

export const useRatesStore = (): RatesContextValue => {
    const context = useContext(RatesContext);

    if (!context) throw new Error('useRatesStore must be used within RatesProvider.');

    return context;
}
