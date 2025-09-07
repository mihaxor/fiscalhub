export const FiscalConfig = {
    DEFAULT_TAXES: {
        cas: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CAS || '0.25'),      // 25% CAS (contributii asigurari sociale - pensie)
        cass: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CASS || '0.10'),    // 10% CASS (contributii asigurari sociale - sanatate)
        iv: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_IV || '0.10'),        // 10% IV (Impozit venit)
        cam: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CAM || '0.0225'),    // 2.25% CAM (contributii asigurari munca)
        micro1: 0.01,                                                        // 1% (Impozit Micro 1)
        micro3: 0.03,                                                        // 3% (Impozit Micro 3)
        srlProfit: 0.16,                                                     // 16% (Impozit SRL pe profit)
        dividend: 0.10                                                       // 10% (Impozit dividende)
    },
    DEFAULT_DP_PAYROLL: 0,                                                   // Deducere personala (lei) pentru calcul salariu
    DEFAULT_DP_COMPANY: 2057.5,                                              // Deducere personala (lei) pentru calcul SRL
    DEDUCTIBLE_EXPENSES: 0,                                                  // Cheltuieli deductibile (pentru SRL)
    INCOME_NORM: 0,                                                          // Norma de venit (pentru PFA)
    MANDATORY_MIN_WAGE: 4050,                                                // Salariul minim obligatoriu (lei)
    ROUND_MODES: ['round', 'floor', 'ceil'] as const
} as const;

export type FiscalConfig = typeof FiscalConfig;