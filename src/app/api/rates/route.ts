import {parseStringPromise} from 'xml2js';
import {NextResponse} from 'next/server';

export async function GET() {
    const bnrAPIUrl = process.env.NEXT_APP_BNR_RATES_API_URL as string;

    try {
        const bnrAPIResponse = await fetch(bnrAPIUrl);
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