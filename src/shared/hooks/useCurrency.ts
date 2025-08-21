'use client';

import {useCallback, useMemo, useState} from 'react';
import {isEmpty} from '@heroui/shared-utils';
import {RateType} from '@/shared/hooks/fiscal.types';

const DEFAULT_EUR_VALUE = 1;
const DEFAULT_USD_VALUE = 1;
const DEFAULT_GBP_VALUE = 1;

const DEFAULT_CURRENCY_EXCHANGE = 'EUR';

type CurrencyType = {
    left: {
        currency: RateType,
        value: string
    },
    right: {
        currency: RateType,
        value: string
    }
}

const useCurrency = (rates: Record<RateType, number> | undefined) => {
    const [eur, setEur] = useState<string>(DEFAULT_EUR_VALUE.toString());
    const [usd, setUsd] = useState<string>(DEFAULT_USD_VALUE.toString());
    const [gbp, setGbp] = useState<string>(DEFAULT_GBP_VALUE.toString());
    const [currency, setCurrency] = useState<CurrencyType>(
        {
            left: {
                currency: 'EUR',
                value: DEFAULT_EUR_VALUE.toString()
            },
            right: {
                currency: 'RON',
                value: rates?.EUR.toString() as string
            }
        });
    const [lastEditedSide, setLastEditedSide] = useState<'left' | 'right'>('left');

    const calculateCurrency = useMemo(() => {
        if (!rates || isEmpty(rates)) return;

        const eurValue = (parseFloat(eur) * rates.EUR).toFixed(4);
        const usdValue = (parseFloat(usd) * rates.USD).toFixed(4);
        const gbpValue = (parseFloat(gbp) * rates.GBP).toFixed(4);

        return {
            EUR: eurValue,
            USD: usdValue,
            GBP: gbpValue
        }
    }, [eur, usd, gbp, rates]);

    const calculateSwitchedCurrency = useMemo(() => {
        if (!rates || isEmpty(rates))
            return {
                leftValue: currency.left.value,
                rightValue: currency.right.value
            };

        const leftCurrency = currency.left.currency;
        const rightCurrency = currency.right.currency;

        const leftValue = parseFloat(currency.left.value) || 0;
        const rightValue = parseFloat(currency.right.value) || 0;

        const leftRate = leftCurrency === 'RON' ? 1 : rates[leftCurrency];
        const rightRate = rightCurrency === 'RON' ? 1 : rates[rightCurrency];

        let calculatedLeftValue: string;
        let calculatedRightValue: string;

        if (lastEditedSide === 'left') {
            let convertedValue: number;

            if (leftCurrency === 'RON' && rightCurrency !== 'RON') {
                convertedValue = leftValue / rightRate;
            } else if (leftCurrency !== 'RON' && rightCurrency === 'RON') {
                convertedValue = leftValue * leftRate;
            } else if (leftCurrency === 'RON' && rightCurrency === 'RON') {
                convertedValue = leftValue;
            } else {
                convertedValue = (leftValue * leftRate) / rightRate;
            }

            calculatedLeftValue = currency.left.value;
            calculatedRightValue = convertedValue.toFixed(2);
        } else {
            let convertedValue: number;

            if (rightCurrency === 'RON' && leftCurrency !== 'RON') {
                convertedValue = rightValue / leftRate;
            } else if (rightCurrency !== 'RON' && leftCurrency === 'RON') {
                convertedValue = rightValue * rightRate;
            } else if (rightCurrency === 'RON' && leftCurrency === 'RON') {
                convertedValue = rightValue;
            } else {
                convertedValue = (rightValue * rightRate) / leftRate;
            }

            calculatedLeftValue = convertedValue.toFixed(2);
            calculatedRightValue = currency.right.value;
        }

        return {
            leftValue: calculatedLeftValue,
            rightValue: calculatedRightValue
        };
    }, [currency, rates, lastEditedSide]);

    const verifyCurrency = useCallback((currency: RateType, rates: Record<RateType, number> | undefined):
    { type: RateType; rate: number } => {

        if (!rates) return {
            type: DEFAULT_CURRENCY_EXCHANGE,
            rate: 1,
        };

        if (currency === 'RON') return {
            type: DEFAULT_CURRENCY_EXCHANGE,
            rate: rates[DEFAULT_CURRENCY_EXCHANGE],
        };

        if (!rates[currency]) throw new Error(`${currency} is not a valid currency.`);

        return {type: currency, rate: rates[currency]};
    }, []);

    return {
        eur,
        setEur,
        usd,
        setUsd,
        gbp,
        setGbp,
        currency,
        setCurrency,
        calculateCurrency,
        calculateSwitchedCurrency,
        lastEditedSide,
        setLastEditedSide,
        verifyCurrency
    }
}

export default useCurrency;