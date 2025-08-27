import {FiscalPeriodType} from '@/shared/hooks/fiscal.types';

export const

    transformToRo = (value: number, decimals: number = 0): string => {
        return new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    },

    toPercentage = (value: number, decimals: number = 0): string => `${(value * 100).toFixed(decimals)}%`,

    toAllPeriods = (value: number, period: FiscalPeriodType) => {
        switch (period) {
            case 'hour':
                return {
                    hour: value,
                    day: value * 8,
                    month: value * 160,
                    year: value * 160 * 12
                };
            case 'day':
                return {
                    hour: value / 8,
                    day: value,
                    month: value / 8 * 160,
                    year: value / 8 * 160 * 12
                }
            case 'month':
                return {
                    hour: value / 160,
                    day: value / 160 * 8,
                    month: value,
                    year: value * 12
                }
            case 'year':
                return {
                    hour: value / (160 * 12),
                    day: value / (160 * 12) * 8,
                    month: value / 12,
                    year: value
                }
        }
    }