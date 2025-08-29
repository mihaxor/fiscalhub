type FiscalType = 'net' | 'gross';
type FiscalPeriodType = 'hour' | 'day' | 'month' | 'year';

export const FiscalCalculationType = {
    CIM: 'CIM',
    SRL: 'SRL',
    MICRO1: 'MICRO1',
    MICRO3: 'MICRO3',
    PFA: 'PFA'
} as const;

export type FiscalCalculationType = typeof FiscalCalculationType[keyof typeof FiscalCalculationType];

type Taxes = {
    cas: number;
    cass: number;
    iv: number;
    cam: number;
}

interface FiscalPayroll {
    fromType: FiscalType;
    value: number;
    dp?: number;
    rate: number;
    roundMode?: 'round' | 'floor' | 'ceil';
}

interface FiscalPayrollResult {
    inputs: { fromType: 'net' | 'gross'; value: number; };
    gross: { lei: number; currency: number; };
    cas: { lei: number; currency: number; };
    cass: { lei: number; currency: number; };
    dp: { lei: number; currency: number; };
    iv: { lei: number; currency: number; };
    net: { lei: number; currency: number; };
    cam: { lei: number; currency: number; };
    totalEmployerCost: { lei: number; currency: number; };
    taxesEmployee: { lei: number; currency: number; };
    taxesEmployer: { lei: number; currency: number; };
    taxesState: { lei: number; currency: number; };
    shares: { employee: number; state: number; };
    symbol?: CurrencySymbol
}

type RateType = 'RON'
    | 'AED' | 'AUD' | 'BGN' | 'BRL' | 'CAD' | 'CHF' | 'CNY' | 'CZK' | 'DKK' | 'EGP'
    | 'EUR' | 'GBP' | 'HKD' | 'HUF' | 'IDR' | 'ILS' | 'INR' | 'ISK' | 'JPY' | 'KRW'
    | 'MDL' | 'MXN' | 'MYR' | 'NOK' | 'NZD' | 'PHP' | 'PLN' | 'RSD' | 'RUB' | 'SEK'
    | 'SGD' | 'THB' | 'TRY' | 'UAH' | 'USD' | 'XAU' | 'XDR' | 'ZAR';

export enum CurrencySymbol {
    RON = 'lei',
    EUR = '€',
    GBP = '£',
    USD = '$'
}

export type {FiscalType, FiscalPeriodType, FiscalPayroll, FiscalPayrollResult, RateType, Taxes};