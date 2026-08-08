import {NextResponse} from 'next/server';
import {parseBnrRates} from '@/app/api/rates/bnrRates';

const CACHE_DURATION = 3600; // cached in seconds for 1 hour

export async function GET() {
    const bnrAPIUrl = process.env.NEXT_APP_BNR_RATES_API_URL;

    try {
        if (!bnrAPIUrl) throw new Error('BNR rates URL is not configured.');

        const bnrAPIResponse = await fetch(bnrAPIUrl, {next: {revalidate: CACHE_DURATION}});

        if (!bnrAPIResponse.ok)
            throw new Error(`BNR rates request failed with status ${bnrAPIResponse.status}.`);

        const contentType = bnrAPIResponse.headers.get('content-type') ?? '';

        if (!contentType.includes('xml'))
            throw new Error(`BNR rates returned an unsupported content type: ${contentType || 'unknown'}.`);

        const xml = await bnrAPIResponse.text();
        const rates = await parseBnrRates(xml);

        return NextResponse.json(rates);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown BNR rates error.';

        console.error('Failed to fetch BNR rates:', message);

        return NextResponse.json(
            {error: 'BNR rates are temporarily unavailable.'},
            {status: 502}
        );
    }
}
