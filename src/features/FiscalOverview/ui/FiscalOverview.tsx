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
import {addToast} from '@heroui/toast';
import {FiscalConfig} from '@/config/fiscal';
import {useTranslation} from 'react-i18next';

const FiscalOverview = () => {
    const {data: rates} = useContext(RatesContext);
    const {verifyCurrency, convertTo} = useCurrency(rates);
    const {fiscalInputs, fiscalYear} = useFiscalStore();
    const {calcPayroll, taxes} = useFiscalPayroll();
    const {calcCompany, verifyGrossInterval} = useFiscalCompany(fiscalYear);
    const isMobile = useMediaQuery('(max-width: 639px)');
    const isMobileCard = useMediaQuery('(max-width: 480px)');
    const {t} = useTranslation();

    const [selected, setSelected] = useState<string | number>(fiscalInputs.calculationType[0] || FiscalCalculationType.CIM);
    const normalisedValue = fiscalInputs.periods.month * (rates?.[fiscalInputs.currency] ?? 1);
    const annualGrossEur = convertTo(fiscalInputs.periods.year, fiscalInputs.currency, 'EUR');

    useEffect(() => {
        checkIntervals();
    }, [annualGrossEur, fiscalInputs.calculationType]);

    const checkIntervals = () => {
        const allowedTypes = fiscalInputs.calculationType
            .filter(type => !verifyGrossInterval(type, annualGrossEur));

        if (allowedTypes.length !== 0) {
            setSelected(allowedTypes[0]);
        } else setSelected(0);

        fiscalInputs.calculationType.forEach(type => {
            const isAllowed = verifyGrossInterval(type, annualGrossEur);

            if (isAllowed) setTimeout(() => addToast({
                title: t('general.calculationTypeWarning.title', {type}),
                description: t(
                    'general.calculationTypeWarning.description',
                    {maxGross: FiscalConfig[`COMPANY_MAX_GROSS_${type}` as keyof typeof FiscalConfig]}
                ),
                color: 'warning',
            }), 200);
        });
    }

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
    }, [fiscalInputs, fiscalYear]);

    const calculationType = (types: FiscalCalculationType[]): React.ReactNode =>
        types.map((type) =>
            <Tab key={type}
                 isDisabled={verifyGrossInterval(type, annualGrossEur)}
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