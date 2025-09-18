import {useCallback} from 'react';
import {
    FiscalCalculationType,
    FiscalCompany,
    FiscalCompanyEntityResult,
    FiscalCompanyResult
} from '@/shared/hooks/fiscal.types';
import {FiscalConfig} from '@/config/fiscal';

const useFiscalCompany = () => {

    const verifyGrossInterval = (type: FiscalCalculationType, grossEur: number): boolean => {
        const disallowedTypes: FiscalCalculationType[] = [];

        if (grossEur > FiscalConfig.COMPANY_MAX_GROSS_MICRO1) disallowedTypes.push(FiscalCalculationType.MICRO1);
        if (grossEur > FiscalConfig.COMPANY_MAX_GROSS_MICRO3) disallowedTypes.push(FiscalCalculationType.MICRO3);

        return disallowedTypes.includes(type);
    };

    const buildFiscalEntityResult = useCallback((
        params: {
            monthlyRevenue: number;
            annualRevenue: number;
            grossProfit: number;
            incomeTax: number;
            netProfit: number;
            dividendTax: number;
            totalCollectedProfit: number;
            minMandatorySalaryAnnual: number;
            cassDividends: number;
            netDividendIncome: number;
            plusMonthlyEarnedWages: number;
            totalTaxes: number;
            totalRemainingPerYear: number;
        },
        roundValue: (v: number) => number,
        exchange: (v: number) => number
    ): FiscalCompanyEntityResult => {
        const {
            monthlyRevenue,
            annualRevenue,
            grossProfit,
            incomeTax,
            netProfit,
            dividendTax,
            totalCollectedProfit,
            minMandatorySalaryAnnual,
            cassDividends,
            netDividendIncome,
            plusMonthlyEarnedWages,
            totalTaxes,
            totalRemainingPerYear
        } = params;

        return {
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
    }, []);

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
            dp = FiscalConfig.DP_COMPANY,
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
                    case FiscalCalculationType.MICRO1:
                    case FiscalCalculationType.MICRO3: {
                        const microTaxes = type === FiscalCalculationType.MICRO1 ? taxes.micro1 : taxes.micro3;
                        const monthlyRevenue = grossAmount;
                        const annualRevenue = monthlyRevenue * 12;

                        const minSalaryMonthly = minWageMandatory;
                        const minMandatorySalaryAnnual = minSalaryMonthly * 12;

                        const grossProfit = annualRevenue - minMandatorySalaryAnnual;
                        const incomeTax = annualRevenue * microTaxes;

                        const netProfit = grossProfit - incomeTax;
                        const dividendTax = netProfit * taxes.dividend;
                        const totalCollectedProfit = netProfit - dividendTax;

                        const cassDividends = minSalaryMonthly * 24 * taxes.cass;

                        const netDividendIncome = totalCollectedProfit - cassDividends;

                        const monthlyCas = minSalaryMonthly * taxes.cas;
                        const monthlyCass = minSalaryMonthly * taxes.cass;
                        const taxBase = Math.max(
                            0,
                            minSalaryMonthly - monthlyCas - monthlyCass - dp
                        );
                        const monthlyIv = taxBase * taxes.iv;
                        const monthlyNetSalary = minSalaryMonthly - monthlyCas - monthlyCass - monthlyIv;
                        const plusMonthlyEarnedWages = monthlyNetSalary * 12;

                        const salaryTaxesAnnual = (monthlyCas + monthlyCass + monthlyIv) * 12;

                        const totalTaxes = incomeTax + dividendTax + cassDividends + salaryTaxesAnnual;

                        const totalRemainingPerYear = netDividendIncome + plusMonthlyEarnedWages;

                        acc[type as FiscalCalculationType] = buildFiscalEntityResult(
                            {
                                monthlyRevenue,
                                annualRevenue,
                                grossProfit,
                                incomeTax,
                                netProfit,
                                dividendTax,
                                totalCollectedProfit,
                                minMandatorySalaryAnnual,
                                cassDividends,
                                netDividendIncome,
                                plusMonthlyEarnedWages,
                                totalTaxes,
                                totalRemainingPerYear
                            },
                            roundValue,
                            exchange
                        );
                        break;
                    }
                    case FiscalCalculationType.SRL: {
                        const monthlyRevenue = grossAmount;
                        const annualRevenue = monthlyRevenue * 12;

                        const grossProfit = annualRevenue;

                        const incomeTax = grossProfit * taxes.srlProfit;

                        const netProfit = grossProfit - incomeTax;

                        const dividendTax = netProfit * taxes.dividend;

                        const totalCollectedProfit = netProfit - dividendTax;

                        const minSalaryMonthly = minWageMandatory;
                        const minMandatorySalaryAnnual = minSalaryMonthly * 12;

                        const cassDividends = minSalaryMonthly * 24 * taxes.cass;

                        const netDividendIncome = totalCollectedProfit - cassDividends;

                        const monthlyCas = minSalaryMonthly * taxes.cas;
                        const monthlyCass = minSalaryMonthly * taxes.cass;
                        const taxBase = Math.max(
                            0,
                            minSalaryMonthly - monthlyCas - monthlyCass - dp
                        );
                        const monthlyIv = taxBase * taxes.iv;
                        const monthlyNetSalary = minSalaryMonthly - monthlyCas - monthlyCass - monthlyIv;
                        const plusMonthlyEarnedWages = monthlyNetSalary * 12;

                        const totalTaxes = incomeTax + dividendTax + cassDividends;

                        const totalRemainingPerYear = totalCollectedProfit - cassDividends;

                        acc[type as FiscalCalculationType] = buildFiscalEntityResult(
                            {
                                monthlyRevenue,
                                annualRevenue,
                                grossProfit,
                                incomeTax,
                                netProfit,
                                dividendTax,
                                totalCollectedProfit,
                                minMandatorySalaryAnnual,
                                cassDividends,
                                netDividendIncome,
                                plusMonthlyEarnedWages,
                                totalTaxes,
                                totalRemainingPerYear
                            },
                            roundValue,
                            exchange
                        );
                        break;
                    }
                    case FiscalCalculationType.PFA: {
                        const annualRevenue = grossAmount * 12;

                        const netIncome = annualRevenue;

                        const minWageAnnual = minWageMandatory * 12;
                        const cas24Salaries = minWageMandatory * 24;
                        const cass6Salaries = minWageMandatory * 6;
                        const cass60Salaries = minWageMandatory * 60;

                        let casContributions = 0;
                        if (annualRevenue >= minWageAnnual) {
                            if (annualRevenue <= cas24Salaries) {
                                casContributions = minWageAnnual * taxes.cas;
                            } else {
                                casContributions = cas24Salaries * taxes.cas;
                            }
                        }

                        let cassContributions = 0;
                        if (annualRevenue > cass6Salaries) {
                            const cassBase = Math.min(annualRevenue, cass60Salaries);
                            cassContributions = cassBase * taxes.cass;
                        }

                        const taxableIncome = annualRevenue - casContributions - cassContributions;

                        const incomeTax = taxableIncome * taxes.iv;

                        const totalTaxes = casContributions + cassContributions + incomeTax;

                        const totalRemainingPerYear = annualRevenue - totalTaxes;

                        acc[type as FiscalCalculationType] = {
                            netIncome: {lei: roundValue(netIncome), currency: exchange(netIncome)},
                            taxableIncome: {lei: roundValue(taxableIncome), currency: exchange(taxableIncome)},
                            incomeTax: {lei: roundValue(incomeTax), currency: exchange(incomeTax)},
                            netProfit: {lei: roundValue(taxableIncome), currency: exchange(taxableIncome)},
                            totalCollectedProfit: {
                                lei: roundValue(totalRemainingPerYear),
                                currency: exchange(totalRemainingPerYear)
                            },
                            cass: {lei: roundValue(cassContributions), currency: exchange(cassContributions)},
                            cas: {lei: roundValue(casContributions), currency: exchange(casContributions)},
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
        verifyGrossInterval,
        taxes: FiscalConfig.DEFAULT_TAXES
    };
};

export default useFiscalCompany;