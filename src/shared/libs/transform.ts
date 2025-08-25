export const

    transformToRo = (value: number, decimals: number = 0): string => {
        return new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    },

    toPercentage = (value: number, decimals: number = 0): string => `${(value * 100).toFixed(decimals)}%`;