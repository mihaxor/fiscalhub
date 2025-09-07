import {useCallback} from 'react';
import {
    FiscalCalculationType,
    FiscalCompany,
    FiscalCompanyEntityResult,
    FiscalCompanyResult
} from '@/shared/hooks/fiscal.types';
import {FiscalConfig} from '@/config/fiscal';

const useFiscalCompany = () => {

    /**
     * Calculator fiscal pentru companii (RO) - SRL, MICRO, PFA
     *
     * @param {Object} opts
     * @param {number} opts.grossAmount                                             - suma brută (lei)
     * @param {'SRL'|'MICRO1'|'MICRO3'|'PFA'} opts.calculationType                  - tipul de taxare
     * @param {Object} [opts.taxes]                                                 - procente (implicite: CAS, CASS, IV, CAM, micro, srlProfit, dividend)
     * @param {number} [opts.taxes.cas]                                             - CAS (contributii asigurari sociale - pensie)
     * @param {number} [opts.taxes.cass]                                            - CASS (contributii asigurari sociale - sanatate)
     * @param {number} [opts.taxes.iv]                                              - IV (Impozit venit)
     * @param {number} [opts.taxes.cam]                                             - CAM (contributii asigurari munca)
     * @param {number} [opts.taxes.micro1]                                          - Impozit micro 1%
     * @param {number} [opts.taxes.micro3]                                          - Impozit micro 3%
     * @param {number} [opts.taxes.srlProfit]                                       - Impozit SRL pe profit 16%
     * @param {number} [opts.taxes.dividend]                                        - Impozit dividende
     * @param {number} [opts.dp]                                                    - deducere personala (lei)
     * @param {number} [opts.minWageMandatory]                                      - salariul minim obligatoriu (lei)
     * @param {number} [opts.deductibleExpenses]                                    - cheltuieli deductibile (pentru SRL)
     * @param {number} [opts.incomeNorm]                                            - norma de venit (pentru PFA)
     * @param {number} opts.rate                                                    - cursul valutar
     * @param {'round'|'floor'|'ceil'} [opts.roundMode="round"]                     - rotunjire pentru afișarea în lei
     *
     * @returns {FiscalCompanyResult}
     */
    const calcCompany = useCallback((opts: FiscalCompany): FiscalCompanyResult => {
        const {
            grossAmount,
            calculationType,
            taxes = FiscalConfig.DEFAULT_TAXES,
            dp = FiscalConfig.DEFAULT_DP_COMPANY,
            minWageMandatory = FiscalConfig.MANDATORY_MIN_WAGE,
            deductibleExpenses = FiscalConfig.DEDUCTIBLE_EXPENSES,
            incomeNorm = FiscalConfig.INCOME_NORM,
            rate,
            roundMode = 'round',
        } = opts;

        const rounders = {round: Math.round, floor: Math.floor, ceil: Math.ceil};
        const roundValue = rounders[roundMode] || Math.round;
        const exchange = (v: number) => v / rate;

        const result = calculationType
            .reduce<Partial<Record<FiscalCalculationType, FiscalCompanyEntityResult>>>
            ((acc, type) => {
                switch (type) {
                    case FiscalCalculationType.SRL:
                    case FiscalCalculationType.PFA:
                    case FiscalCalculationType.MICRO1:
                    case FiscalCalculationType.MICRO3: {
                        const monthlyRevenue = grossAmount;
                        const annualRevenue = monthlyRevenue * 12;

                        // Salariul minim obligatoriu
                        const minSalaryMonthly = minWageMandatory;
                        const minMandatorySalaryAnnual = minSalaryMonthly * 12;

                        // Profit brut și impozit micro
                        const grossProfit = annualRevenue - minMandatorySalaryAnnual;
                        const incomeTax = annualRevenue * taxes.micro3;

                        // Profit net și dividende
                        const netProfit = grossProfit - incomeTax;
                        const dividendTax = netProfit * taxes.dividend;
                        const totalCollectedProfit = netProfit - dividendTax;

                        // CASS pe dividende
                        const cassDividends = minSalaryMonthly * 24 * taxes.cass;

                        // Venit net din dividende
                        const netDividendIncome = totalCollectedProfit - cassDividends;

                        // Net salarial pentru salariul minim (cu DP fixă folosită în simulare)
                        const monthlyCas = minSalaryMonthly * taxes.cas;
                        const monthlyCass = minSalaryMonthly * taxes.cass;
                        const taxBase = Math.max(
                            0,
                            minSalaryMonthly - monthlyCas - monthlyCass - dp
                        );
                        const monthlyIv = taxBase * taxes.iv;
                        const monthlyNetSalary = minSalaryMonthly - monthlyCas - monthlyCass - monthlyIv;
                        const plusMonthlyEarnedWages = monthlyNetSalary * 12;

                        // Taxe din salariu (pentru donut)
                        const salaryTaxesAnnual = (monthlyCas + monthlyCass + monthlyIv) * 12;

                        // Total taxe (pentru donut) = impozit micro + impozit dividende + CASS dividende + taxe salariu
                        const totalTaxes = incomeTax + dividendTax + cassDividends + salaryTaxesAnnual;

                        // Total rămas pe an = dividende nete + salarii nete
                        const totalRemainingPerYear = netDividendIncome + plusMonthlyEarnedWages;

                        acc[type as FiscalCalculationType] = {
                            grossIncome: {lei: roundValue(monthlyRevenue), currency: exchange(monthlyRevenue)},
                            netIncome: {lei: roundValue(monthlyRevenue), currency: exchange(monthlyRevenue)},

                            grossProfit: {lei: roundValue(grossProfit), currency: exchange(grossProfit)},
                            incomeTax: {lei: roundValue(incomeTax), currency: exchange(incomeTax)},
                            netProfit: {lei: roundValue(netProfit), currency: exchange(netProfit)},

                            dividendTax: {lei: roundValue(dividendTax), currency: exchange(dividendTax)},
                            totalCollectedProfit: {
                                lei: roundValue(totalCollectedProfit),
                                currency: exchange(totalCollectedProfit)
                            },
                            minMandatoryWage: {
                                lei: roundValue(minMandatorySalaryAnnual),
                                currency: exchange(minMandatorySalaryAnnual)
                            },
                            cass: {lei: roundValue(cassDividends), currency: exchange(cassDividends)},
                            netDividendIncome: {
                                lei: roundValue(netDividendIncome),
                                currency: exchange(netDividendIncome)
                            },
                            plusMonthlyEarnedWages: {
                                lei: roundValue(plusMonthlyEarnedWages),
                                currency: exchange(plusMonthlyEarnedWages)
                            },
                            totalTaxes: {lei: roundValue(totalTaxes), currency: exchange(totalTaxes)},
                            shares: {
                                income: totalRemainingPerYear / annualRevenue,
                                taxes: totalTaxes / annualRevenue,
                            },
                            totalRemaining: {
                                year: {
                                    lei: roundValue(totalRemainingPerYear),
                                    currency: exchange(totalRemainingPerYear)
                                },
                                month: {
                                    lei: roundValue(totalRemainingPerYear / 12),
                                    currency: exchange(totalRemainingPerYear / 12)
                                },
                                quarter: {
                                    lei: roundValue(totalRemainingPerYear / 4),
                                    currency: exchange(totalRemainingPerYear / 4)
                                }
                            }
                        } as FiscalCompanyEntityResult;
                        break;
                    }
                    default:
                        throw new Error(`The calculation type "${calculationType}" is not recognised.`);
                }
                return acc;
            }, {});

        return {
            result,
            inputs: {
                grossAmount,
                calculationType,
                deductibleExpenses,
                incomeNorm
            }
        };
    }, []);
    return {
        calcCompany,
        taxes: FiscalConfig.DEFAULT_TAXES
    };
};

export default useFiscalCompany;