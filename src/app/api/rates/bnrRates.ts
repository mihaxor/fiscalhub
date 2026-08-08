import {parseStringPromise} from 'xml2js';

const REQUIRED_CURRENCIES = ['EUR', 'USD', 'GBP'] as const;
const RATE_DECIMAL_PRECISION = 10;

type BnrRates = Record<string, number>;
type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === 'object' && value !== null;

const getFirstArrayItem = (value: unknown): unknown =>
    Array.isArray(value) ? value[0] : undefined;

const getBnrRateEntries = (data: unknown): unknown[] => {
    if (!isRecord(data)) throw new Error('BNR rates response has an invalid structure.');

    const dataSet = data.DataSet;

    if (!isRecord(dataSet)) throw new Error('BNR rates response has an invalid structure.');

    const body = getFirstArrayItem(dataSet.Body);

    if (!isRecord(body)) throw new Error('BNR rates response has an invalid structure.');

    const cube = getFirstArrayItem(body.Cube);

    if (!isRecord(cube) || !Array.isArray(cube.Rate) || cube.Rate.length === 0)
        throw new Error('BNR rates response has an invalid structure.');

    return cube.Rate;
};

const normalizeBnrRate = (rate: unknown): [string, number] | undefined => {
    if (!isRecord(rate) || !isRecord(rate.$)) return undefined;

    const currency = rate.$.currency;
    const rawValue = rate._;
    const rawMultiplier = rate.$.multiplier ?? 1;

    if (typeof currency !== 'string' ||
        (typeof rawValue !== 'string' && typeof rawValue !== 'number') ||
        (typeof rawMultiplier !== 'string' && typeof rawMultiplier !== 'number')) return undefined;

    const value = Number(rawValue);
    const multiplier = Number(rawMultiplier);

    if (!currency.trim() || !Number.isFinite(value) || value <= 0 ||
        !Number.isFinite(multiplier) || multiplier <= 0) return undefined;

    const normalizedValue = Number((value / multiplier).toFixed(RATE_DECIMAL_PRECISION));

    return [currency.trim(), normalizedValue];
};

export const parseBnrRates = async (xml: string): Promise<BnrRates> => {
    const data: unknown = await parseStringPromise(xml);
    const rates = getBnrRateEntries(data).reduce<BnrRates>((normalizedRates, rate) => {
        const normalizedRate = normalizeBnrRate(rate);

        if (normalizedRate) normalizedRates[normalizedRate[0]] = normalizedRate[1];

        return normalizedRates;
    }, {});

    if (!REQUIRED_CURRENCIES.every(currency => Number.isFinite(rates[currency]) && rates[currency] > 0))
        throw new Error('BNR rates response is missing required currencies.');

    return rates;
};
