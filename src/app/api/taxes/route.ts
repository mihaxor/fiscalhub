import {NextResponse} from 'next/server';
import {Taxes} from '@/shared/hooks/fiscal.types';

export async function GET() {
    return NextResponse.json({
        cas: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CAS || '0.25'),   // 25% CAS (contributii asigurari sociale - pensie)
        cass: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CASS || '0.10'), // 10% CASS (contributii asigurari sociale - sanatate)
        iv: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_IV || '0.10'),     // 10% IV (Impozit venit)
        cam: parseFloat(process.env.NEXT_PUBLIC_APP_TAX_CAM || '0.0225')  // 2.25% CAM (contributii asigurari munca)
    } as Taxes);
}