import {Tab, Tabs} from '@heroui/tabs';
import React, {useContext, useMemo, useState} from 'react';
import {Switch} from '@heroui/switch';
import {useFiscalStore} from '@/shared/store/useFiscalStore';
import useFiscalPayroll from '@/shared/hooks/useFiscalPayroll';
import {FiscalCalculationType, FiscalType} from '@/shared/hooks/fiscal.types';
import useCurrency from '@/shared/hooks/useCurrency';
import {RatesContext} from '@/shared/store/useRatesStore';
import FiscalEmployment from './FiscalEmployment';
import FiscalCompanySRL from './FiscalCompanySRL';

const FiscalOverview = () => {
    const [isVertical, setIsVertical] = useState<boolean>(false);

    const {data: rates} = useContext(RatesContext);
    const {verifyCurrency} = useCurrency(rates);
    const {fiscalInputs} = useFiscalStore();
    const {calcPayroll, taxes} = useFiscalPayroll();

    const [selected, setSelected] = useState<string | number>(fiscalInputs.calculationType[0] || FiscalCalculationType.CIM);

    console.log('Fiscal Inputs:', fiscalInputs);

    console.log(calcPayroll({
        fromType: fiscalInputs.fromType.toLowerCase() as FiscalType,
        value: fiscalInputs.value,
        rate: verifyCurrency(fiscalInputs.currency, rates)?.rate
    }))

    const payrollResult = useMemo(() => calcPayroll({
        fromType: fiscalInputs.fromType.toLowerCase() as FiscalType,
        value: fiscalInputs.value,
        rate: verifyCurrency(fiscalInputs.currency, rates)?.rate
    }), [fiscalInputs]);

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
                            return null;
                        case FiscalCalculationType.PFA:
                            return null;
                        default:
                            return null;
                    }
                })()}
            </Tab>
        )
    }

    if (fiscalInputs.value === 0) return null;

    return (
        <div className='flex flex-col justify-center items-start w-full sm:w-lg'>
            <Switch className='mb-4' color='secondary' isSelected={isVertical} onValueChange={setIsVertical}>
                Vertical
            </Switch>
            <Tabs aria-label='Options' selectedKey={selected} color='primary' variant='bordered' radius='md'
                  isVertical={isVertical}
                  onSelectionChange={setSelected}
            >
                {calculationType(fiscalInputs.calculationType)}
            </Tabs>
        </div>
    );
}

export default FiscalOverview;