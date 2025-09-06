import {useCallback} from 'react';
import {
    FiscalCalculationType,
    FiscalCompany,
    FiscalCompanyEntityResult,
    FiscalCompanyResult
} from '@/shared/hooks/fiscal.types';

const useFiscalCompany = () => {
    /**
     * Calculator fiscal pentru companii (RO) - SRL, MICRO, PFA
     *
     * @param {Object} opts
     * @param {number} opts.grossAmount                                 - suma brută (lei)
     * @param {'SRL_PROFIT_16'|'MICRO_1'|'MICRO_3'|'PFA'} opts.calculationType - tipul de taxare
     * @param {number} [opts.cheltuieliDeductibile=0]                   - cheltuieli deductibile (lei)
     * @param {number} [opts.normaDeVenit=0]                            - norma de venit pentru PFA (lei)
     * @param {number} opts.rate                                        - cursul valutar
     * @param {'round'|'floor'|'ceil'} [opts.roundMode="round"]         - rotunjire pentru afișarea în lei
     *
     * @returns {FiscalCompanyResult}
     */
    const calcCompany = useCallback((opts: FiscalCompany): FiscalCompanyResult => {
        const {
            grossAmount,
            calculationType,
            deductibleExpenses = 0,
            incomeNorm = 0,
            rate,
            roundMode = 'round',
        } = opts;

        const rounders = {round: Math.round, floor: Math.floor, ceil: Math.ceil};
        const roundValue = rounders[roundMode] || Math.round;
        const exchange = (v: number) => v / rate;

        const SALARIUL_MINIM_OBLIGATORIU = 4050;
        const CAS_RATE = 0.25;
        const CASS_RATE = 0.10;
        const IV_RATE = 0.10;
        const PROFIT_TAX_16 = 0.16;
        const MICRO_TAX_1 = 0.01;
        const MICRO_TAX_3 = 0.03;
        const DIVIDEND_TAX = 0.10;
        const PERSONAL_DEDUCTION = 2057.5;

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
                        const minSalaryMonthly = SALARIUL_MINIM_OBLIGATORIU;
                        const minMandatorySalaryAnnual = minSalaryMonthly * 12;

                        // Profit brut și impozit micro
                        const grossProfit = annualRevenue - minMandatorySalaryAnnual;
                        const incomeTax = annualRevenue * MICRO_TAX_3;

                        // Profit net și dividende
                        const netProfit = grossProfit - incomeTax;
                        const dividendTax = netProfit * DIVIDEND_TAX;
                        const totalCollectedProfit = netProfit - dividendTax;

                        // CASS pe dividende
                        const cassDividends = minSalaryMonthly * 24 * CASS_RATE;

                        // Venit net din dividende
                        const netDividendIncome = totalCollectedProfit - cassDividends;

                        // Net salarial pentru salariul minim (cu DP fixă folosită în simulare)
                        const monthlyCas = minSalaryMonthly * CAS_RATE;
                        const monthlyCass = minSalaryMonthly * CASS_RATE;
                        const taxBase = Math.max(
                            0,
                            minSalaryMonthly - monthlyCas - monthlyCass - PERSONAL_DEDUCTION
                        );
                        const monthlyIv = taxBase * IV_RATE;
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
                            totalRemainingPerYear,
                            totalRemainingPerMonth: {
                                lei: roundValue(totalRemainingPerYear / 12),
                                currency: exchange(totalRemainingPerYear / 12)
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

    return {calcCompany};
};

export default useFiscalCompany;