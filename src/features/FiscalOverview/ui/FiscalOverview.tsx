'use client';

import {Tab, Tabs} from '@heroui/tabs';
import React, {useContext, useEffect, useMemo, useState} from 'react';
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
    const {verifyCurrency, convertTo} = useCurrency(rates);
    const {fiscalInputs} = useFiscalStore();
    const {calcPayroll, taxes} = useFiscalPayroll();
    const {calcCompany} = useFiscalCompany();
    const isMobile = useMediaQuery('(max-width: 639px)');
    const isMobileCard = useMediaQuery('(max-width: 480px)');

    const [selected, setSelected] = useState<string | number>(fiscalInputs.calculationType[0] || FiscalCalculationType.CIM);
    const normalisedValue = fiscalInputs.periods.month * (rates?.[fiscalInputs.currency] ?? 1);
    const annualGrossEur = convertTo(fiscalInputs.periods.year, fiscalInputs.currency, 'EUR');

    // FIXME: check if calculation not available because of the interval
    useEffect(() => { // Reset selected tab if not in available types
        if (!fiscalInputs.calculationType.includes(selected as FiscalCalculationType))
            setSelected(fiscalInputs.calculationType[0]);
    }, [fiscalInputs.calculationType]);

    // useEffect(() => { // Notify user if selected calculation type is not available for the given gross
    //     fiscalInputs.calculationType.forEach(type => {
    //         const isAllowed = verifyGrossInterval(type, annualGrossEur);
    //
    //         if (isAllowed) setTimeout(() => addToast({
    //             title: `Impozitarea la ${type} nu se aplica`,
    //             description: `Venitul anual depaseste pragul cifrei de afaceri de ${FiscalConfig[`COMPANY_MAX_GROSS_${type}` as keyof typeof FiscalConfig]} euro`,
    //             color: 'warning',
    //         }), 200);
    //     })
    // }, [annualGrossEur, fiscalInputs.calculationType]);

    const payrollResult = useMemo(() => {
        const currencyVerified = verifyCurrency(fiscalInputs.currency, rates);

        return ({
            ...calcPayroll({
                fromType: fiscalInputs.fromType.toLowerCase() as FiscalType,
                value: normalisedValue,
                rate: currencyVerified.rate
            }),
            symbol: CurrencySymbol[currencyVerified.type as keyof typeof CurrencySymbol],
        });
    }, [fiscalInputs]);

    const companyResult = useMemo(() => {
        const currencyVerified = verifyCurrency(fiscalInputs.currency, rates);

        return ({
            ...calcCompany({
                grossAmount: normalisedValue,
                calculationType: fiscalInputs.calculationType.filter(type => type !== FiscalCalculationType.CIM),
                rate: currencyVerified.rate
            }),
            symbol: CurrencySymbol[currencyVerified.type as keyof typeof CurrencySymbol],
        });
    }, [fiscalInputs]);

    const calculationType = (types: FiscalCalculationType[]): React.ReactNode =>
        types.map((type) =>
            <Tab key={type}
                 // isDisabled={verifyGrossInterval(type, annualGrossEur)}
                 title={type.toUpperCase()}
                 className='p-0 sm:px-7.25 lg:px-10'>
                <FiscalCard
                    calcType={type}
                    taxes={taxes}
                    handler={type === FiscalCalculationType.CIM ? payrollResult : companyResult}
                    isMobile={isMobileCard}
                />
            </Tab>
        )

    if (fiscalInputs.value === 0 || annualGrossEur === 0) return null;

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