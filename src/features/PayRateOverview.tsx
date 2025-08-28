import {useFiscalStore} from '@/shared/store/useFiscalStore';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import React, {useContext, useMemo, useState} from 'react';
import {CurrencySymbol, RateType} from '@/shared/hooks/fiscal.types';
import {RatesContext} from '@/shared/store/useRatesStore';
import useCurrency from '@/shared/hooks/useCurrency';
import {transformToRo} from '@/shared/libs/transform';
import {Spinner} from '@heroui/spinner';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';

const PayRateOverview = () => {
    const {data: rates, isLoading} = useContext(RatesContext);
    const {convertTo} = useCurrency(rates);
    const {fiscalInputs} = useFiscalStore();

    const [selectedCurrencyKeys, setSelectedCurrencyKeys] = useState<Set<RateType>>(new Set(['EUR']));
    const selectedCurrencyValue = useMemo(() => Array.from(selectedCurrencyKeys)[0], [selectedCurrencyKeys]);

    const convertToRon = (value: number, fromCurrency: RateType) => {
        if (!rates) return value;
        return fromCurrency === 'RON' ? value : convertTo(value, fromCurrency, 'RON');
    }

    const getSymbol = (currency: RateType) =>
        currency === 'RON' ? '€' : CurrencySymbol[currency as keyof typeof CurrencySymbol];

    if (isLoading) return <div className='flex w-full justify-center sm:w-lg h-[250px]'><Spinner size='md' /></div>;

    return (
        <Table layout='auto' isCompact={false} aria-label={`Table for pay rates overview`}>
            <TableHeader>
                <TableColumn>RATA</TableColumn>
                <TableColumn>RON</TableColumn>
                <TableColumn align='center' className='p-0' width={1}>
                    VALUTA
                    <Dropdown classNames={{content: 'min-w-max'}}>
                        <DropdownTrigger>
                            <Button className='text-fiscal-warning text-small min-w-0 p-4 ml-2'
                                    variant='ghost'>{getSymbol(selectedCurrencyValue)}</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label='Select pay rate currency'
                            selectionMode='single'
                            onSelectionChange={(keys) => setSelectedCurrencyKeys(new Set(Array.from(keys as Set<RateType>)))}
                        >
                            <DropdownItem key='EUR'>EUR</DropdownItem>
                            <DropdownItem key='USD'>USD</DropdownItem>
                            <DropdownItem key='GBP'>GBP</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </TableColumn>
            </TableHeader>
            <TableBody>
                {Object.keys(fiscalInputs.periods).map((key) => (
                    <TableRow key={key}>
                        <TableCell>{key.toUpperCase()}</TableCell>
                        <TableCell>{transformToRo(convertToRon(fiscalInputs.periods[key as keyof typeof fiscalInputs.periods], fiscalInputs.currency), key === 'hour' ? 2 : 0)}</TableCell>
                        <TableCell>{transformToRo(convertTo(fiscalInputs.periods[key as keyof typeof fiscalInputs.periods], fiscalInputs.currency, selectedCurrencyValue), key === 'hour' ? 2 : 0)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default PayRateOverview;