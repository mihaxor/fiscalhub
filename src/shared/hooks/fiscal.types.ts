interface FiscalPayroll {
    from: 'net' | 'gross';
    value: number;
    dp?: number; // deducere personala
    rates?: {
        cas: number; // CAS
        cass: number; // CASS
        iv: number; // impozit venit
        cam: number; // contributii asigurari munca
    };
    eurRate?: number; // curs lei/€
    roundMode?: 'round' | 'floor' | 'ceil'; // mod de rotunjire
}

interface FiscalPayrollResult {
    inputs: { from: 'net' | 'gross'; value: number; };
    gross: { lei: number; eur: number; };
    cas: { lei: number; eur: number; };
    cass: { lei: number; eur: number; };
    dp: { lei: number; eur: number; };
    iv: { lei: number; eur: number; };
    net: { lei: number; eur: number; };
    cam: { lei: number; eur: number; };
    totalEmployerCost: { lei: number; eur: number; };
    taxesEmployee: { lei: number; eur: number; };
    taxesEmployer: { lei: number; eur: number; };
    taxesState: { lei: number; eur: number; };
    shares: { employee: number; state: number; };
}

type RateType = 'EUR' | 'GBP' | 'USD' | 'AED' | 'AUD' | 'BGN' | 'BRL' | 'CAD';

export type {FiscalPayroll, FiscalPayrollResult, RateType};
