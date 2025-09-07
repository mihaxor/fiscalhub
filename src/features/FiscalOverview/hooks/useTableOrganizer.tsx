import {TFunction} from 'i18next';
import {FiscalCalculationType, FiscalCompanyResult, FiscalPayrollResult, Taxes} from '@/shared/hooks/fiscal.types';
import PopoverInfo from '@/shared/components/PopoverInfo';
import React from 'react';
import {toPercentage, transformToRo} from '@/shared/libs/transform';

type TableOrganizer = {
    header: {
        columns: (React.ReactElement | string | null)[];
        className?: string
    };
    rows: {
        cells: (React.ReactElement | string | number | null)[];
        className?: string;
    }[];
}

export const useTableOrganizer = (taxes: Taxes, t: TFunction) => {

    const verifyNetType = (value: string) =>
        value === 'net' ? 'bg-fiscal-warning text-black [&>td]:font-semibold [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md' : 'text-fiscal-primary [&>td]:font-bold';

    const verifyGrossType = (value: string) =>
        value === 'gross' ? 'bg-fiscal-warning text-black [&>td]:font-semibold [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md' : 'text-fiscal-primary [&>td]:font-bold';

    const transformToMobile = (popoverText: string, text: string, isMobile: boolean): string | React.ReactElement =>
        !isMobile ? `${popoverText} (${text})` : <PopoverInfo popoverText={popoverText} text={text} />

    const getTableStyle = (
        type: FiscalCalculationType,
        handler: FiscalPayrollResult | FiscalCompanyResult,
        isMobile: boolean
    ): TableOrganizer[] => {
        switch (type) {
            case FiscalCalculationType.CIM: {
                const payroll = handler as FiscalPayrollResult;

                return [
                    {
                        header: {
                            columns: [t('overview.employment.tables.employee.title'), null, 'RON', (
                                <>{t('overview.employment.tables.employee.foreignCurrency')} <span
                                    className='text-fiscal-warning text-small'>{payroll.symbol}</span></>
                            )]
                        },
                        rows: [
                            {
                                cells: [t('overview.employment.tables.employee.rows.grossSalary'), null, transformToRo(payroll.gross.lei), transformToRo(payroll.gross.currency, 2)],
                                className: verifyNetType(payroll.inputs.fromType)
                            },
                            {cells: [transformToMobile(t('overview.employment.tables.employee.rows.socialInsurance'), t('overview.employment.tables.employee.rows.socialInsuranceShort'), isMobile), toPercentage(taxes.cas), transformToRo(payroll.cas.lei), transformToRo(payroll.cas.currency, 2)]},
                            {cells: [transformToMobile(t('overview.employment.tables.employee.rows.healthInsurance'), t('overview.employment.tables.employee.rows.healthInsuranceShort'), isMobile), toPercentage(taxes.cass), transformToRo(payroll.cass.lei), transformToRo(payroll.cass.currency, 2)]},
                            {cells: [transformToMobile(t('overview.employment.tables.employee.rows.personalDeduction'), t('overview.employment.tables.employee.rows.personalDeductionShort'), isMobile), null, 0, 0]},
                            {cells: [transformToMobile(t('overview.employment.tables.employee.rows.incomeTax'), t('overview.employment.tables.employee.rows.incomeTaxShort'), isMobile), toPercentage(taxes.iv), transformToRo(payroll.iv.lei), transformToRo(payroll.iv.currency, 2)]},
                            {
                                cells: [t('overview.employment.tables.employee.rows.netSalary'), null, transformToRo(payroll.net.lei), transformToRo(payroll.net.currency, 2)],
                                className: verifyGrossType(payroll.inputs.fromType)
                            }
                        ]
                    },
                    {
                        header: {
                            columns: [t('overview.employment.tables.employer.title'), null, 'RON', t('overview.employment.tables.employer.foreignCurrency')]
                        },
                        rows: [
                            {cells: [transformToMobile(t('overview.employment.tables.employer.rows.workInsurance'), t('overview.employment.tables.employer.rows.workInsuranceShort'), isMobile), toPercentage(taxes.cam, 2), transformToRo(payroll.cam.lei), transformToRo(payroll.cam.currency, 2)]},
                            {cells: [t('overview.employment.tables.employer.rows.totalSalary'), null, transformToRo(payroll.totalEmployerCost.lei), transformToRo(payroll.totalEmployerCost.currency, 2)]}
                        ]
                    },
                    {
                        header: {
                            columns: [t('overview.employment.tables.totalTaxes.title'), null, 'RON', t('overview.employment.tables.totalTaxes.foreignCurrency')]
                        },
                        rows: [
                            {cells: [t('overview.employment.tables.totalTaxes.rows.employeePaysState'), null, transformToRo(payroll.taxesEmployee.lei), transformToRo(payroll.taxesEmployee.currency, 2)]},
                            {cells: [t('overview.employment.tables.totalTaxes.rows.employerPaysState'), null, transformToRo(payroll.taxesEmployer.lei), transformToRo(payroll.taxesEmployer.currency, 2)]},
                            {
                                cells: [t('overview.employment.tables.totalTaxes.rows.totalStateRevenue'), null, transformToRo(payroll.taxesState.lei), transformToRo(payroll.taxesState.currency, 2)],
                                className: 'text-fiscal-primary [&>td]:font-bold'
                            }
                        ]
                    }
                ]
            }
            case FiscalCalculationType.MICRO3: {
                const company = handler as FiscalCompanyResult;

                return [
                    {
                        header: {
                            columns: ['PROFIT CA ADMINISTRATOR(I)', null, 'RON', (<>{'VALUTA'} <span
                                className='text-fiscal-warning text-small'>{company.symbol}</span></>)]
                        },
                        rows: [
                            {
                                cells: ['Total pe an', null, transformToRo(company.result[type]!.totalRemaining.year.lei), transformToRo(company.result[type]!.totalRemaining.year.currency)],
                                className: 'bg-fiscal-warning text-black [&>td]:font-semibold [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md'
                            },
                            {cells: ['Total pe quarter', null, transformToRo(company.result[type]!.totalRemaining.quarter.lei), transformToRo(company.result[type]!.totalRemaining.quarter.currency)]},
                            {cells: ['Total pe luna', null, transformToRo(company.result[type]!.totalRemaining.month.lei), transformToRo(company.result[type]!.totalRemaining.month.currency)]},
                        ]
                    },
                    {
                        header: {
                            columns: ['VENITURI SI PROFITURI', null, 'RON', (<>{'VALUTA'} <span
                                className='text-fiscal-warning text-small'>{company.symbol}</span></>)]
                        },
                        rows: [
                            {cells: ['Profit brut', null, transformToRo(company.result[type]!.grossProfit.lei), transformToRo(company.result[type]!.grossProfit.currency)]},
                            {cells: ['Profit net', null, transformToRo(company.result[type]!.netProfit.lei), transformToRo(company.result[type]!.netProfit.currency)]},
                            {
                                cells: ['Total profit incasat', null, transformToRo(company.result[type]!.totalCollectedProfit.lei), transformToRo(company.result[type]!.totalCollectedProfit.currency)],
                                className: 'text-fiscal-primary [&>td]:font-bold'
                            },
                            {cells: ['Venit net din dividende', null, transformToRo(company.result[type]!.netDividendIncome.lei), transformToRo(company.result[type]!.netDividendIncome.currency)]},
                            {cells: ['Plus salariile încasate lunar', null, transformToRo(company.result[type]!.plusMonthlyEarnedWages.lei), transformToRo(company.result[type]!.plusMonthlyEarnedWages.currency)]},
                        ]
                    },
                    {
                        header: {
                            columns: ['IMPOZITE SI CONTRIBUTII', null, 'RON', (<>{'VALUTA'} <span
                                className='text-small'>{company.symbol}</span></>)],
                            className: 'text-fiscal-primary [&>th]:font-bold'
                        },
                        rows: [
                            {
                                cells: [<PopoverInfo key='incomeTax' popoverText='3% din venitul brut'
                                                     text='Impozit venit' />, null, transformToRo(company.result[type]!.incomeTax.lei), transformToRo(company.result[type]!.incomeTax.currency)]
                            },
                            {
                                cells: [<PopoverInfo key='dividendTax'
                                                     popoverText='10% din profitul distribuit asociaților'
                                                     text='Impozit dividende' />, null, transformToRo(company.result[type]!.dividendTax.lei), transformToRo(company.result[type]!.dividendTax.currency)]
                            },
                            {cells: [transformToMobile('Asigurǎri Sociale de Sǎnǎtate', 'CASS', isMobile), null, transformToRo(company.result[type]!.cass.lei), transformToRo(company.result[type]!.cass.currency)]}
                        ]
                    },
                    {
                        header: {
                            columns: ['OBLIGATII LEGATE FIXE', null, 'RON', (<>{'VALUTA'} <span
                                className='text-fiscal-warning text-small'>{company.symbol}</span></>)]
                        },
                        rows: [
                            {
                                cells: [<PopoverInfo key='minMandatoryWage'
                                                     popoverText='Salariul minim brut pentru un angajat, necesar pentru a te încadra ca microîntreprindere.'
                                                     text='Salariul minim obligatoriu' />, null, transformToRo(company.result[type]!.minMandatoryWage.lei), transformToRo(company.result[type]!.minMandatoryWage.currency)]
                            },
                        ]
                    }
                ];
            }
            case FiscalCalculationType.SRL:
            case FiscalCalculationType.MICRO1:
            case FiscalCalculationType.PFA:
                return [];
            default:
                return [];
        }
    }

    return {getTableStyle};
}