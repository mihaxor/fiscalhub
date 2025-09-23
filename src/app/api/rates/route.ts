import {parseStringPromise} from 'xml2js';
import {NextResponse} from 'next/server';

const CACHE_DURATION = 3600; // cached in seconds for 1 hour

export async function GET() {
    const bnrAPIUrl = process.env.NEXT_APP_BNR_RATES_API_URL as string;

    try {
        const bnrAPIResponse = await fetch(bnrAPIUrl, {next: {revalidate: CACHE_DURATION}});
        const xml = await bnrAPIResponse.text();
        const data = await parseStringPromise(xml);

        const rates = data.DataSet.Body[0].Cube[0].Rate.reduce((acc: { [x: string]: number; }, r: {
            $: { currency: string | number; };
            _: string;
        }) => {
            acc[r.$.currency] = parseFloat(r._);
            return acc;
        }, {});

        return NextResponse.json(rates);
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {error: 'Failed to fetch rates'},
            {status: 500}
        );
    }
}