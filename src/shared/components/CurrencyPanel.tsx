'use client';

import {Chip} from '@heroui/chip';
import {Input} from '@heroui/input';
import React, {useContext} from 'react';
import {RatesContext} from '@/shared/store/useRatesStore';
import {Spinner} from '@heroui/spinner';
import {Button} from '@heroui/button';
import {ArrowLeftRight, ArrowRightLeft} from 'lucide-react';
import {CurrencySymbol, RateType} from '@/shared/hooks/fiscal.types';
import useCurrency from '@/shared/hooks/useCurrency';

const DEFAULT_CURRENCY_OPTIONS = [
    'RON', 'AED', 'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK',
    'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW',
    'MDL', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RSD', 'RUB', 'SEK',
    'SGD', 'THB', 'TRY', 'UAH', 'USD', 'XAU', 'XDR', 'ZAR', 'EGP'
].sort((a, b) => a.localeCompare(b));

const CurrencyPanel = ({}) => {
    const {data: rates, isLoading} = useContext(RatesContext);
    const {
        eur,
        setEur,
        usd,
        setUsd,
        gbp,
        setGbp,
        currency,
        setCurrency,
        lastEditedSide,
        setLastEditedSide,
        calculateCurrency,
        calculateSwitchedCurrency
    } = useCurrency(rates);

    const handleValueChange =
        (e: React.ChangeEvent<HTMLInputElement>, cb: (
             value: string) => void,
         // initialValue?: number
        ) => {
            // if (isEmpty(e.target.value)) {
            //     cb(initialValue.toString());
            //     return;
            // }
            cb(e.target.value);
        }

    if (isLoading) return <div className='flex w-full justify-center sm:w-lg h-[250px]'><Spinner size='md' /></div>;

    return (
        <div className='flex flex-col justify-between gap-4 w-full sm:w-lg'>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valoare'
                    value={eur}
                    variant='bordered'
                    onChange={(e) => handleValueChange(e, setEur)}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>€</span>
                        </div>
                    }
                />
                <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>EUR</Chip>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valuta'
                    value={calculateCurrency?.EUR.toString()}
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-700 text-small'>lei</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valoare'
                    value={usd}
                    variant='bordered'
                    onChange={(e) => handleValueChange(e, setUsd)}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>$</span>
                        </div>
                    }
                />
                <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>USD</Chip>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valuta'
                    value={calculateCurrency?.USD.toString()}
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-700 text-small'>lei</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valoare'
                    value={gbp}
                    variant='bordered'
                    onChange={(e) => handleValueChange(e, setGbp)}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>£</span>
                        </div>
                    }
                />
                <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>GBP</Chip>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valuta'
                    value={calculateCurrency?.GBP.toString()}
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-700 text-small'>lei</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valoare'
                    variant='bordered'
                    value={calculateSwitchedCurrency?.leftValue?.toString()}
                    onChange={(e) => {
                        setLastEditedSide('left');
                        setCurrency(prev => ({
                            ...prev,
                            left: {...prev.left, value: e.target.value}
                        }))
                    }}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span
                                className='text-default-400 text-small'>{CurrencySymbol[currency.left.currency as keyof typeof CurrencySymbol]}</span>
                        </div>
                    }
                    endContent={
                        <div className='flex items-center'>
                            <select
                                aria-label='Select currency'
                                className='outline-solid outline-transparent border-0 bg-transparent text-default-700 text-small'
                                defaultValue={currency.left.currency}
                                id='currency'
                                name='currency'
                                onChange={(e) => {
                                    setLastEditedSide('left');
                                    setCurrency(prev => ({
                                        ...prev,
                                        left: {...prev.left, currency: e.target.value as RateType}
                                    }))
                                }}
                            >
                                {DEFAULT_CURRENCY_OPTIONS.map((option: string, key: number) => (
                                    <option key={key} aria-label={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                />
                <Button size='lg' radius='sm' isIconOnly aria-label='Switcw-currency' color='default' variant='flat'>
                    {lastEditedSide === 'left' ? <ArrowLeftRight /> : <ArrowRightLeft />}
                </Button>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valoare'
                    variant='bordered'
                    value={calculateSwitchedCurrency?.rightValue?.toString()}
                    onChange={(e) => {
                        setLastEditedSide('right');
                        setCurrency(prev => ({
                            ...prev,
                            right: {...prev.right, value: e.target.value}
                        }))
                    }
                    }
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span
                                className='text-default-400 text-small'>{CurrencySymbol[currency.right.currency as keyof typeof CurrencySymbol]}</span>
                        </div>
                    }
                    endContent={
                        <div className='flex items-center'>
                            <select
                                aria-label='Select currency'
                                className='outline-solid outline-transparent border-0 bg-transparent text-default-700 text-small'
                                defaultValue={currency.right.currency}
                                id='currency'
                                name='currency'
                                onChange={(e) => {
                                    setLastEditedSide('right');
                                    setCurrency(prev => ({
                                        ...prev,
                                        right: {...prev.right, currency: e.target.value as RateType}
                                    }))
                                }}
                            >
                                {DEFAULT_CURRENCY_OPTIONS.map((option: string, key: number) => (
                                    <option key={key} aria-label={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row justify-end gap-4 w-full'>
                <p className='text-xs text-default-400'>curs actualizat automat, sursa <strong>BNR</strong>.</p>
            </div>
        </div>
    )
}

export default CurrencyPanel;