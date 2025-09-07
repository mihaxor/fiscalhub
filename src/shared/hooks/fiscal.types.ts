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
    micro1: number,
    micro3: number,
    srlProfit: number,
    dividend: number
}

interface FiscalPayroll {
    fromType: FiscalType;
    value: number;
    taxes?: Taxes;
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
    shares: { income: number; taxes: number; };
    symbol?: CurrencySymbol
}

interface FiscalCompany {
    grossAmount: number;
    calculationType: FiscalCalculationType[];
    taxes?: Taxes;
    dp?: number;
    minWageMandatory?: number,
    deductibleExpenses?: number;
    incomeNorm?: number;
    rate: number;
    roundMode?: 'round' | 'floor' | 'ceil';
}

interface FiscalCompanyResult {
    inputs: {
        grossAmount: number;
        calculationType: FiscalCalculationType[];
        deductibleExpenses?: number;
        incomeNorm?: number;
    };
    result: Partial<Record<FiscalCalculationType, FiscalCompanyEntityResult>>;
    symbol?: CurrencySymbol
}

interface FiscalCompanyEntityResult {
    grossIncome: { lei: number; currency: number; };
    grossProfit: { lei: number; currency: number; };
    netIncome: { lei: number; currency: number; };
    netProfit: { lei: number; currency: number; };
    incomeTax: { lei: number; currency: number; };
    dividendTax: { lei: number; currency: number; };
    totalCollectedProfit: { lei: number; currency: number; };
    cass: { lei: number; currency: number; };
    minMandatoryWage: { lei: number; currency: number; };
    netDividendIncome: { lei: number; currency: number; };
    plusMonthlyEarnedWages: { lei: number; currency: number; };
    totalTaxes: { lei: number; currency: number; };
    totalRemaining: {
        year: { lei: number; currency: number; };
        quarter: { lei: number; currency: number; };
        month: { lei: number; currency: number; };
    }
    shares: {
        income: number;
        taxes: number;
    };
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

export type {
    FiscalType,
    FiscalPeriodType,
    FiscalPayroll,
    FiscalPayrollResult,
    FiscalCompany,
    FiscalCompanyResult,
    FiscalCompanyEntityResult,
    RateType,
    Taxes
};