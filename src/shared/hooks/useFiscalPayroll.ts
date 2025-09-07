import {useCallback} from 'react';
import {FiscalPayroll, FiscalPayrollResult} from '@/shared/hooks/fiscal.types';
import {FiscalConfig} from '@/config/fiscal';

const useFiscalPayroll = () => {

    /**
     * Payroll calculator (RO) – unificat: din NET sau din GROSS
     *
     * @param {Object} opts
     * @param {'net'|'gross'} opts.fromType                         - baza de calcul (implicit: 'net')
     * @param {number} opts.value                                   - valoarea (net sau gross, după `fromType`)
     * @param {number} [opts.dp]                                    - deducere personala (lei)
     * @param {Object} [opts.taxes]                                 - procente (implicite: CAS, CASS, IV, CAM)
     * @param {number} [opts.taxes.cas]                             - CAS (contributii asigurari sociale - pensie)
     * @param {number} [opts.taxes.cass]                            - CASS (contributii asigurari sociale - sanatate)
     * @param {number} [opts.taxes.iv]                              - IV (Impozit venit)
     * @param {number} [opts.taxes.cam]                             - CAM (contributii asigurari munca)
     * @param {number} [opts.rate]                                  - cursul valutar
     * @param {'round'|'floor'|'ceil'} [opts.roundMode="round"]     - rotunjire pentru afisarea in lei
     *
     * @returns {{
     *   inputs: {fromType:'net'|'gross', value:number},
     *   gross:{lei:number, eur:number},
     *   cas:{lei:number, eur:number},
     *   cass:{lei:number, eur:number},
     *   dp:{lei:number, eur:number},
     *   iv:{lei:number, eur:number},
     *   net:{lei:number, eur:number},
     *   cam:{lei:number, eur:number},
     *   totalEmployerCost:{lei:number, eur:number},                - total cost angajator
     *   taxesEmployee:{lei:number, eur:number},                    - taxe angajat
     *   taxesEmployer:{lei:number, eur:number},                    - taxe angajator
     *   taxesState:{lei:number, eur:number},                       - taxe stat
     *   shares:{ employee:number, state:number }                   - procentajul din costul total
     * }}
     */
    const calcPayroll = useCallback((opts: FiscalPayroll): FiscalPayrollResult => {
        const {
            fromType,
            value,
            taxes = FiscalConfig.DEFAULT_TAXES,
            dp = FiscalConfig.DEFAULT_DP_PAYROLL,
            rate,
            roundMode = 'round',
        } = opts;

        const rounders = {round: Math.round, floor: Math.floor, ceil: Math.ceil};
        const roundValue = rounders[roundMode] || Math.round;
        const exchange = (v: number) => v / rate;

        const cas = (g: number) => g * taxes.cas;
        const cass = (g: number) => g * taxes.cass;
        const ivVal = (g: number) => {
            const base = Math.max(0, g - cas(g) - cass(g) - dp);
            return base * taxes.iv;
        };
        const net = (g: number) => g - cas(g) - cass(g) - ivVal(g);
        const cam = (g: number) => g * taxes.cam;
        const totalEmployer = (g: number) => g + cam(g);

        let gross;

        if (fromType === 'gross') {
            gross = value;
        } else if (fromType === 'net') {
            const A = 1 - taxes.cas - taxes.cass;
            const denom = A * (1 - taxes.iv);

            if (denom <= 0) throw new Error('Rate invalid conversion.');
            gross = (value - taxes.iv * dp) / denom;
        } else throw new Error('The parameter "fromType" should be "net" or "gross".');

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
            inputs: {fromType, value},
            gross: {lei: roundValue(gross), currency: exchange(gross)},
            cas: {lei: roundValue(casLei), currency: exchange(casLei)},
            cass: {lei: roundValue(cassLei), currency: exchange(cassLei)},
            dp: {lei: roundValue(dp), currency: exchange(dp)},
            iv: {lei: roundValue(ivLei), currency: exchange(ivLei)},
            net: {lei: roundValue(netLei), currency: exchange(netLei)},
            cam: {lei: roundValue(camLei), currency: exchange(camLei)},
            totalEmployerCost: {lei: roundValue(totalCost), currency: exchange(totalCost)},
            taxesEmployee: {lei: roundValue(taxesEmployee), currency: exchange(taxesEmployee)},
            taxesEmployer: {lei: roundValue(taxesEmployer), currency: exchange(taxesEmployer)},
            taxesState: {lei: roundValue(taxesState), currency: exchange(taxesState)},
            shares: {
                income: netLei / totalCost,
                taxes: taxesState / totalCost
            }
        };
    }, []);
    return {
        calcPayroll,
        taxes: FiscalConfig.DEFAULT_TAXES
    };
}

export default useFiscalPayroll;
