'use client';

import {Tab, Tabs} from '@heroui/tabs';
import React, {useContext, useMemo, useState} from 'react';
import {useFiscalStore} from '@/shared/store/useFiscalStore';
import useFiscalPayroll from '@/shared/hooks/useFiscalPayroll';
import {CurrencySymbol, FiscalCalculationType, FiscalType} from '@/shared/hooks/fiscal.types';
import useCurrency from '@/shared/hooks/useCurrency';
import {RatesContext} from '@/shared/store/useRatesStore';
import FiscalCard from './FiscalCard';
import AnimatedContent from '@/shared/components/AnimatedContent';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import useFiscalCompany from '@/shared/hooks/useFiscalCompany';

const FiscalOverview = () => {
    const {data: rates} = useContext(RatesContext);
    const {verifyCurrency} = useCurrency(rates);
    const {fiscalInputs} = useFiscalStore();
    const {calcPayroll, taxes} = useFiscalPayroll();
    const {calcCompany} = useFiscalCompany();
    const isMobile = useMediaQuery('(max-width: 639px)');

    const [selected, setSelected] = useState<string | number>(fiscalInputs.calculationType[0] || FiscalCalculationType.CIM);

    const payrollResult = useMemo(() => {
        const currencyVerified = verifyCurrency(fiscalInputs.currency, rates);

        return ({
            ...calcPayroll({
                fromType: fiscalInputs.fromType.toLowerCase() as FiscalType,
                value: fiscalInputs.periods.month * (rates?.[fiscalInputs.currency] ?? 1),
                rate: currencyVerified.rate
            }),
            symbol: CurrencySymbol[currencyVerified.type as keyof typeof CurrencySymbol],
        });
    }, [fiscalInputs]);

    const companyResult = useMemo(() => {
        const currencyVerified = verifyCurrency(fiscalInputs.currency, rates);

        return ({
            ...calcCompany({
                grossAmount: fiscalInputs.periods.month * (rates?.[fiscalInputs.currency] ?? 1),
                calculationType: fiscalInputs.calculationType.filter(type => type !== FiscalCalculationType.CIM),
                rate: currencyVerified.rate
            }),
            symbol: CurrencySymbol[currencyVerified.type as keyof typeof CurrencySymbol],
        });
    }, [fiscalInputs]);

    const calculationType = (types: FiscalCalculationType[]): React.ReactNode => {
        return types.map((type) =>
            <Tab key={type} title={type.toUpperCase()} className='p-0 sm:px-7.25 lg:px-10'>
                <FiscalCard
                    calcType={type}
                    taxes={taxes}
                    handler={type === FiscalCalculationType.CIM ? payrollResult : companyResult}
                />
            </Tab>
        )
    }

    if (fiscalInputs.value === 0 && payrollResult.gross.currency === 0) return null;

    return (
        <div id='result'>
            <AnimatedContent>
                <div className='flex flex-col justify-center items-center gap-8'>
                    <Tabs aria-label='Options' selectedKey={selected} color='primary' variant='bordered' radius='md'
                          onSelectionChange={setSelected} fullWidth={isMobile}>
                        {calculationType(fiscalInputs.calculationType)}
                    </Tabs>
                </div>
            </AnimatedContent>
        </div>
    );
}

export default FiscalOverview;