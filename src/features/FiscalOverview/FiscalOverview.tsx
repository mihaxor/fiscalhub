'use client';

import {Tab, Tabs} from '@heroui/tabs';
import React, {useContext, useMemo, useState} from 'react';
import {useFiscalStore} from '@/shared/store/useFiscalStore';
import useFiscalPayroll from '@/shared/hooks/useFiscalPayroll';
import {CurrencySymbol, FiscalCalculationType, FiscalType} from '@/shared/hooks/fiscal.types';
import useCurrency from '@/shared/hooks/useCurrency';
import {RatesContext} from '@/shared/store/useRatesStore';
import FiscalEmployment from './FiscalEmployment';
import FiscalCompanySRL from './FiscalCompanySRL';
import AnimatedContent from '@/shared/components/AnimatedContent';
import FiscalCompanyMicro3 from '@/features/FiscalOverview/FiscalCompantMicro3';

const FiscalOverview = () => {
    const {data: rates} = useContext(RatesContext);
    const {verifyCurrency} = useCurrency(rates);
    const {fiscalInputs} = useFiscalStore();
    const {calcPayroll, taxes} = useFiscalPayroll();

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

    const calculationType = (types: FiscalCalculationType[]): React.ReactNode => {
        return types.map((type) =>
            <Tab key={type} title={type.toUpperCase()}>
                {(() => {
                    switch (type) {
                        case FiscalCalculationType.CIM:
                            return <FiscalEmployment payroll={payrollResult} taxes={taxes} />;
                        case FiscalCalculationType.SRL:
                            return <FiscalCompanySRL />;
                        case FiscalCalculationType.MICRO1:
                            return null;
                        case FiscalCalculationType.MICRO3:
                            return <FiscalCompanyMicro3 />;
                        case FiscalCalculationType.PFA:
                            return null;
                        default:
                            return null;
                    }
                })()}
            </Tab>
        )
    }

    console.log('Fiscal Inputs:', fiscalInputs);
    console.log('Payroll Result:', payrollResult);

    if (fiscalInputs.value === 0 && payrollResult.gross.currency === 0) return null;

    return (
        <div id='result'>
            <AnimatedContent>
                <div className='flex flex-col justify-center items-center w-full'>
                    <Tabs aria-label='Options' selectedKey={selected} color='primary' variant='bordered' radius='md'
                          onSelectionChange={setSelected}>
                        {calculationType(fiscalInputs.calculationType)}
                    </Tabs>
                </div>
            </AnimatedContent>
        </div>
    );
}

export default FiscalOverview;