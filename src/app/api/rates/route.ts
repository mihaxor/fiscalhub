import {parseStringPromise} from 'xml2js';
import {NextResponse} from 'next/server';

const CACHE_DURATION = 3600; // cached in seconds for 1 hour

interface BnrRate {
    $: {
        currency: string;
        multiplier?: string;
    };
    _: string;
}

interface BnrDataSet {
    DataSet?: {
        Body?: Array<{
            Cube?: Array<{
                Rate?: BnrRate[];
            }>;
        }>;
    };
}

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
        const data = await parseStringPromise(xml) as BnrDataSet;
        const bnrRates = data.DataSet?.Body?.[0]?.Cube?.[0]?.Rate;

        if (!bnrRates?.length) throw new Error('BNR rates response has an invalid structure.');

        const rates = bnrRates.reduce<Record<string, number>>((acc, rate) => {
            const value = Number.parseFloat(rate._);

            if (rate.$.currency && Number.isFinite(value)) acc[rate.$.currency] = value;
            return acc;
        }, {});

        if (!rates.EUR || !rates.USD || !rates.GBP)
            throw new Error('BNR rates response is missing required currencies.');

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
