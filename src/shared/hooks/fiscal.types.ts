type FiscalType = 'net' | 'gross';
type FiscalPeriodType = 'hour' | 'daily' | 'monthly' | 'yearly';
type FiscalCalculationType = 'CIM' | 'SRL' | 'MICRO1' | 'MICRO3' | 'PFA';

interface FiscalPayroll {
    fromType: FiscalType;
    value: number;
    dp?: number;                // deducere personala
    taxes?: {
        cas: number;            // CAS
        cass: number;           // CASS
        iv: number;             // impozit venit
        cam: number;            // contributii asigurari munca
    };
    rate: number;               // cursul valutar
    roundMode?: 'round' | 'floor' | 'ceil'; // mod de rotunjire
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

export type {FiscalType, FiscalPeriodType, FiscalCalculationType, FiscalPayroll, FiscalPayrollResult, RateType};