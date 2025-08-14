import {useCallback} from 'react';
import {FiscalPayroll, FiscalPayrollResult} from '@/shared/hooks/fiscal.types';

const useFiscalPayroll = () => {

    /**
     * Payroll calculator (RO) – unificat: din NET sau din BRUT
     *
     * @param {Object} opts
     * @param {'net'|'gross'} opts.from   - de unde pornești calculul
     * @param {number} opts.value         - valoarea (net sau brut, după `from`)
     * @param {number} [opts.dp=0]        - deducere personala (lei)
     * @param {Object} [opts.rates]       - procente (implicite: CAS 25%, CASS 10%, IV 10%, CAM 2.25%)
     * @param {number} [opts.rates.cas=0.25]
     * @param {number} [opts.rates.cass=0.10]
     * @param {number} [opts.rates.iv=0.10]
     * @param {number} [opts.rates.cam=0.0225]
     * @param {number} [opts.eurRate=5.0683] - curs lei/€ pentru coloana EUR
     * @param {'round'|'floor'|'ceil'} [opts.roundMode="round"] - rotunjire pentru afisarea in lei
     *
     * @returns {{
     *   inputs: {from:'net'|'gross', value:number},
     *   gross:{lei:number, eur:number},
     *   cas:{lei:number, eur:number},
     *   cass:{lei:number, eur:number},
     *   dp:{lei:number, eur:number},
     *   iv:{lei:number, eur:number},
     *   net:{lei:number, eur:number},
     *   cam:{lei:number, eur:number},
     *   totalEmployerCost:{lei:number, eur:number},
     *   taxesEmployee:{lei:number, eur:number},
     *   taxesEmployer:{lei:number, eur:number},
     *   taxesState:{lei:number, eur:number},
     *   shares:{ employee:number, state:number }
     * }}
     */
    const calcPayroll = useCallback((opts: FiscalPayroll): FiscalPayrollResult => {
        const {
            from,
            value,
            dp = 0,
            rates = {
                cas: 0.25,
                cass: 0.10,
                iv: 0.10,
                cam: 0.0225
            },
            eurRate = 5.0683,
            roundMode = 'round',
        } = opts;

        const rounders = {round: Math.round, floor: Math.floor, ceil: Math.ceil};
        const r = rounders[roundMode] || Math.round;
        const toEur = (v: number) => v / eurRate;

        // — helpers —
        const cas = (g: number) => g * rates.cas;
        const cass = (g: number) => g * rates.cass;
        const ivVal = (g: number) => {
            const base = Math.max(0, g - cas(g) - cass(g) - dp);
            return base * rates.iv;
        };
        const net = (g: number) => g - cas(g) - cass(g) - ivVal(g);
        const cam = (g: number) => g * rates.cam;
        const totalEmployer = (g: number) => g + cam(g);

        let gross;

        if (from === 'gross') {
            gross = value;
        } else if (from === 'net') {
            const A = 1 - rates.cas - rates.cass;
            const denom = A * (1 - rates.iv);

            if (denom <= 0) throw new Error('Rate invalide pentru inversare net->brut.');
            gross = (value - rates.iv * dp) / denom;
        } else throw new Error('Parametrul "from" trebuie să fie "net" sau "gross".');

        const casLei = cas(gross);
        const cassLei = cass(gross);
        const ivLei = ivVal(gross);
        const netLei = net(gross);
        const camLei = cam(gross);
        const totalCost = totalEmployer(gross);

        const taxesEmployee = casLei + cassLei + ivLei;
        const taxesEmployer = camLei;
        const taxesState = taxesEmployee + taxesEmployer;

        return {
            inputs: {from, value},
            gross: {lei: r(gross), eur: toEur(gross)},
            cas: {lei: r(casLei), eur: toEur(casLei)},
            cass: {lei: r(cassLei), eur: toEur(cassLei)},
            dp: {lei: r(dp), eur: toEur(dp)},
            iv: {lei: r(ivLei), eur: toEur(ivLei)},
            net: {lei: r(netLei), eur: toEur(netLei)},
            cam: {lei: r(camLei), eur: toEur(camLei)},
            totalEmployerCost: {lei: r(totalCost), eur: toEur(totalCost)},
            taxesEmployee: {lei: r(taxesEmployee), eur: toEur(taxesEmployee)},
            taxesEmployer: {lei: r(taxesEmployer), eur: toEur(taxesEmployer)},
            taxesState: {lei: r(taxesState), eur: toEur(taxesState)},
            shares: {
                employee: netLei / totalCost,
                state: taxesState / totalCost
            }
        };
    }, []);
    return {
        calcPayroll
    };
}

export default useFiscalPayroll;
