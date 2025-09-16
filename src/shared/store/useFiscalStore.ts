import {create} from 'zustand';
import {FiscalCalculationType, FiscalPeriodType, FiscalType, RateType} from '@/shared/hooks/fiscal.types';

const DEFAULT_FISCAL_INPUTS = {
    value: 0,
    currency: 'RON' as RateType,
    period: 'month' as FiscalPeriodType,
    periods: {
        hour: 0,
        day: 0,
        month: 0,
        year: 0
    },
    fromType: 'net' as FiscalType,
    calculationType: ['CIM', 'SRL', 'MICRO3'] as FiscalCalculationType[]
}

type FiscalState = {
    fiscalInputs: {
        value: number;
        currency: RateType;
        period: FiscalPeriodType;
        periods: {
            hour: number;
            day: number;
            month: number;
            year: number;
        },
        fromType: FiscalType;
        calculationType: FiscalCalculationType[];
    },
    setFiscalInputs: (inputs: FiscalState['fiscalInputs']) => void;
}

export const useFiscalStore = create<FiscalState>((set) => ({
    fiscalInputs: DEFAULT_FISCAL_INPUTS,
    setFiscalInputs: (inputs: FiscalState['fiscalInputs']) => set({fiscalInputs: inputs})
}));