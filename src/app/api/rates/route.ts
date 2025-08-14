import {parseStringPromise} from 'xml2js';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        const bnrAPIResponse = await fetch('https://www.bnr.ro/nbrfxrates.xml');
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