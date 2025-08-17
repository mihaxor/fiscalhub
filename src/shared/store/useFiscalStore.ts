import {create} from 'zustand';
import {FiscalCalculationType, FiscalPeriodType, FiscalType, RateType} from '@/shared/hooks/fiscal.types';

const DEFAULT_FISCAL_INPUTS = {
    value: 0.00,
    currency: 'RON' as RateType,
    period: 'monthly' as FiscalPeriodType,
    fromType: 'net' as FiscalType,
    calculationType: ['CIM', 'SRL'] as FiscalCalculationType[]
}

type FiscalState = {
    fiscalInputs: {
        value: number;
        currency: RateType;
        period: FiscalPeriodType;
        fromType: FiscalType;
        calculationType: FiscalCalculationType[];
    },
    setFiscalInputs: (inputs: FiscalState['fiscalInputs']) => void;
}

export const useFiscalStore = create<FiscalState>((set) => ({
    fiscalInputs: DEFAULT_FISCAL_INPUTS,
    setFiscalInputs: (inputs: FiscalState['fiscalInputs']) => set({fiscalInputs: inputs})
}));