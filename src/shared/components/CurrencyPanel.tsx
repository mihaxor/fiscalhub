'use client';

import {Chip} from '@heroui/chip';
import {Input} from '@heroui/input';
import React, {useContext, useMemo, useState} from 'react';
import {RatesContext} from '@/shared/hooks/useRates';
import {Spinner} from '@heroui/spinner';
import {isEmpty} from '@heroui/shared-utils';

const INITIAL_EUR_VALUE = 1;
const INITIAL_USD_VALUE = 1;
const INITIAL_GBP_VALUE = 1;

const CurrencyPanel = ({}) => {
    const {data: rates, isLoading} = useContext(RatesContext);
    const [eur, setEur] = useState<string>(INITIAL_EUR_VALUE.toString());
    const [usd, setUsd] = useState<string>(INITIAL_USD_VALUE.toString());
    const [gbp, setGbp] = useState<string>(INITIAL_GBP_VALUE.toString());

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


    const handleValueChange =
        (e: React.ChangeEvent<HTMLInputElement>, cb: (value: string) => void, initialValue: number) => {
            if (isEmpty(e.target.value)) {
                cb(initialValue.toString());
                return;
            }
            cb(e.target.value);
        }

    if (isLoading) return <div className='flex h-[250px]'><Spinner size='md' /></div>;

    return (
        <div className='flex flex-col justify-between gap-4 w-[450px]'>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    type='number'
                    label='Valoare'
                    value={eur}
                    variant='bordered'
                    onChange={(e) => handleValueChange(e, setEur, INITIAL_EUR_VALUE)}
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
                    label='Currency'
                    value={calculateCurrency?.EUR.toString()}
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-700 text-small'>RON</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    label='Valoare'
                    value={usd}
                    variant='bordered'
                    onChange={(e) => handleValueChange(e, setUsd, INITIAL_USD_VALUE)}
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
                    label='Currency'
                    value={calculateCurrency?.USD.toString()}
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-700 text-small'>RON</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    label='Valoare'
                    value={gbp}
                    variant='bordered'
                    onChange={(e) => handleValueChange(e, setGbp, INITIAL_GBP_VALUE)}
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
                    label='Currency'
                    value={calculateCurrency?.GBP.toString()}
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-700 text-small'>RON</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    label='Valoare'
                    value='1'
                    variant='bordered'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>€</span>
                        </div>
                    }
                    endContent={
                        <div className='flex items-center'>
                            <label className='sr-only' htmlFor='currency'>
                                Currency
                            </label>
                            <select
                                aria-label='Select currency'
                                className='outline-solid outline-transparent border-0 bg-transparent text-default-700 text-small'
                                defaultValue='USD'
                                id='currency'
                                name='currency'
                            >
                                <option aria-label='US Dollar' value='USD'>
                                    RON
                                </option>
                                <option aria-label='Argentine Peso' value='ARS'>
                                    EUR
                                </option>
                                <option aria-label='Euro' value='EUR'>
                                    USD
                                </option>
                            </select>
                        </div>
                    }
                />
                <Input
                    color='primary'
                    size='sm'
                    label='Currency'
                    value='5.123123'
                    variant='bordered'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>RON</span>
                        </div>
                    }
                    endContent={
                        <div className='flex items-center'>
                            <label className='sr-only' htmlFor='currency'>
                                Currency
                            </label>
                            <select
                                aria-label='Select currency'
                                className='outline-solid outline-transparent border-0 bg-transparent text-default-700 text-small'
                                defaultValue='USD'
                                id='currency'
                                name='currency'
                            >
                                <option aria-label='US Dollar' value='USD'>
                                    RON
                                </option>
                                <option aria-label='Argentine Peso' value='ARS'>
                                    EUR
                                </option>
                                <option aria-label='Euro' value='EUR'>
                                    USD
                                </option>
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