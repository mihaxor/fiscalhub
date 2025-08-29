export const FiscalConfig = {
    DEFAULT_TAXES: {
        cas: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CAS || '0.25'),   // 25% CAS (contributii asigurari sociale - pensie)
        cass: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CASS || '0.10'), // 10% CASS (contributii asigurari sociale - sanatate)
        iv: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_IV || '0.10'),     // 10% IV (Impozit venit)
        cam: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CAM || '0.0225')  // 2.25% CAM (contributii asigurari munca)
    },
    DEFAULT_DP: 0,                                                        // Deducere personala (lei)
    ROUND_MODES: ['round', 'floor', 'ceil'] as const
} as const;

export type FiscalConfig = typeof FiscalConfig;