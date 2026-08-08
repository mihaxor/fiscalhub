import {describe, expect, it} from 'vitest';
import {parseBnrRates} from '@/app/api/rates/bnrRates';

const createBnrXml = (rates: string): string => `
    <DataSet>
        <Body>
            <Cube date="2026-08-09">
                ${rates}
            </Cube>
        </Body>
    </DataSet>
`;

describe('parseBnrRates', () => {
    it('keeps regular rates and normalizes every multiplier currency', async () => {
        const xml = createBnrXml(`
            <Rate currency="EUR">5.1000</Rate>
            <Rate currency="USD">4.4000</Rate>
            <Rate currency="GBP">5.9000</Rate>
            <Rate currency="HUF" multiplier="100">1.2800</Rate>
            <Rate currency="IDR" multiplier="100">0.0280</Rate>
            <Rate currency="ISK" multiplier="100">3.1500</Rate>
            <Rate currency="JPY" multiplier="100">2.9400</Rate>
            <Rate currency="KRW" multiplier="100">0.3100</Rate>
        `);

        const rates = await parseBnrRates(xml);

        expect(rates).toMatchObject({
            EUR: 5.1,
            USD: 4.4,
            GBP: 5.9
        });
        expect(rates.HUF).toBeCloseTo(0.0128, 8);
        expect(rates.IDR).toBeCloseTo(0.00028, 8);
        expect(rates.ISK).toBeCloseTo(0.0315, 8);
        expect(rates.JPY).toBeCloseTo(0.0294, 8);
        expect(rates.KRW).toBeCloseTo(0.0031, 8);
    });

    it('ignores optional currencies with invalid values or multipliers', async () => {
        const xml = createBnrXml(`
            <Rate currency="EUR">5.1000</Rate>
            <Rate currency="USD">4.4000</Rate>
            <Rate currency="GBP">5.9000</Rate>
            <Rate currency="HUF" multiplier="0">1.2800</Rate>
            <Rate currency="JPY" multiplier="invalid">2.9400</Rate>
            <Rate currency="KRW">invalid</Rate>
        `);

        await expect(parseBnrRates(xml)).resolves.toEqual({
            EUR: 5.1,
            USD: 4.4,
            GBP: 5.9
        });
    });

    it('rejects an invalid XML structure', async () => {
        await expect(parseBnrRates('<DataSet />')).rejects.toThrow(
            'BNR rates response has an invalid structure.'
        );
    });

    it('rejects a response without every required currency', async () => {
        const xml = createBnrXml(`
            <Rate currency="EUR">5.1000</Rate>
            <Rate currency="USD">4.4000</Rate>
        `);

        await expect(parseBnrRates(xml)).rejects.toThrow(
            'BNR rates response is missing required currencies.'
        );
    });
});
