import React from 'react';
import {Card, CardBody} from '@heroui/card';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import {FiscalPayrollResult, Taxes} from '@/shared/hooks/fiscal.types';
import {CircularProgress} from '@heroui/progress';
import {Chip} from '@heroui/chip';
import {toPercentage, transformToRo} from '@/shared/libs/transform';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import PopoverInfo from '@/shared/components/PopoverInfo';
import PayRateOverview from '@/features/PayRateOverview';
import {useTheme} from 'next-themes';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

type TableOrganizer = {
    header: (React.ReactElement | string | null)[];
    rows: {
        cells: (React.ReactElement | string | number | null)[];
        className?: string;
    }[];
}

const TABLE_ORGANIZER = (payroll: FiscalPayrollResult, taxes: Taxes, isMobile: boolean, t: TFunction): TableOrganizer[] => {

    const verifyNetType = (value: string) =>
        value === 'net' ? 'bg-fiscal-warning text-black [&>td]:font-semibold [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md' : 'text-fiscal-primary [&>td]:font-bold';

    const verifyGrossType = (value: string) =>
        value === 'gross' ? 'bg-fiscal-warning text-black [&>td]:font-semibold [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md' : 'text-fiscal-primary [&>td]:font-bold';

    const transformToMobile = (popoverText: string, text: string) =>
        !isMobile ? `${popoverText} (${text})` : <PopoverInfo popoverText={popoverText} text={text} />

    return [
        {
            header: [t('overview.employment.tables.employee.title'), null, 'RON', (
                <>{t('overview.employment.tables.employee.foreignCurrency')} <span
                    className='text-fiscal-warning text-small'>{payroll.symbol}</span></>
            )],
            rows: [
                {
                    cells: [t('overview.employment.tables.employee.rows.grossSalary'), null, transformToRo(payroll.gross.lei), transformToRo(payroll.gross.currency, 2)],
                    className: verifyNetType(payroll.inputs.fromType)
                },
                {cells: [transformToMobile(t('overview.employment.tables.employee.rows.socialInsurance'), t('overview.employment.tables.employee.rows.socialInsuranceShort')), toPercentage(taxes.cas), transformToRo(payroll.cas.lei), transformToRo(payroll.cas.currency, 2)]},
                {cells: [transformToMobile(t('overview.employment.tables.employee.rows.healthInsurance'), t('overview.employment.tables.employee.rows.healthInsuranceShort')), toPercentage(taxes.cass), transformToRo(payroll.cass.lei), transformToRo(payroll.cass.currency, 2)]},
                {cells: [transformToMobile(t('overview.employment.tables.employee.rows.personalDeduction'), t('overview.employment.tables.employee.rows.personalDeductionShort')), null, 0, 0]},
                {cells: [transformToMobile(t('overview.employment.tables.employee.rows.incomeTax'), t('overview.employment.tables.employee.rows.incomeTaxShort')), toPercentage(taxes.iv), transformToRo(payroll.iv.lei), transformToRo(payroll.iv.currency, 2)]},
                {
                    cells: [t('overview.employment.tables.employee.rows.netSalary'), null, transformToRo(payroll.net.lei), transformToRo(payroll.net.currency, 2)],
                    className: verifyGrossType(payroll.inputs.fromType)
                }
            ]
        },
        {
            header: [t('overview.employment.tables.employer.title'), null, 'RON', t('overview.employment.tables.employer.foreignCurrency')],
            rows: [
                {cells: [transformToMobile(t('overview.employment.tables.employer.rows.workInsurance'), t('overview.employment.tables.employer.rows.workInsuranceShort')), toPercentage(taxes.cam, 2), transformToRo(payroll.cam.lei), transformToRo(payroll.cam.currency, 2)]},
                {cells: [t('overview.employment.tables.employer.rows.totalSalary'), null, transformToRo(payroll.totalEmployerCost.lei), transformToRo(payroll.totalEmployerCost.currency, 2)]}
            ]
        },
        {
            header: [t('overview.employment.tables.totalTaxes.title'), null, 'RON', t('overview.employment.tables.totalTaxes.foreignCurrency')],
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
};

const FiscalEmployment: React.FC<{
    payroll: FiscalPayrollResult,
    taxes: Taxes
}> = ({payroll, taxes}) => {
    const isMobile = useMediaQuery('(max-width: 480px)');
    const {theme} = useTheme();
    const {t} = useTranslation();

    return (
        <Card radius='md' classNames={{
            base: 'bg-[unset] shadow-none'
        }}>
            <CardBody
                className='flex flex-row flex-wrap-reverse lg:flex-nowrap justify-center items-stretch p-0.5 gap-3 lg:gap-10'>
                <div>
                    {TABLE_ORGANIZER(payroll, taxes, isMobile, t).map((table, index) => (
                        <Table key={index} layout='auto' isCompact={false}
                               aria-label={`Table for ${table.header[0]}`}
                               className='mb-3 lg:w-150 xl:w-3xl'>
                            <TableHeader>
                                {table.header.map((column, index) => (
                                    <TableColumn key={index}
                                                 width={index === 0 ? 340 : 100}>{column} </TableColumn>))}
                            </TableHeader>
                            <TableBody>
                                {table.rows.map((row, index) => (
                                    <TableRow key={index} className={row.className}>
                                        {row.cells.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>{cell}</TableCell>))}
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                    ))}
                    <div className='px-6 text-small text-center'>{t('overview.employment.summary.netPaymentText')} <span
                        className='text-fiscal-warning'>{payroll.net.lei} lei</span>, {t('overview.employment.summary.employerSpendsText')}
                        <span className='text-fiscal-primary'> {payroll.totalEmployerCost.lei} lei</span></div>
                </div>
                <div className='w-full md:w-2xl lg:w-sm flex flex-col justify-evenly gap-3'>
                    <div className='m-2 lg:m-20 flex flex-row lg:flex-col items-center justify-center gap-4'>
                        <div>
                            <CircularProgress
                                aria-label='Circle Taxes Percentage'
                                classNames={{
                                    svg: 'w-40 h-40 drop-shadow-lg',
                                    indicator: 'stroke-primary/90',
                                    track: 'stroke-warning',
                                    value: `text-2xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`,
                                }}
                                showValueLabel={true}
                                strokeWidth={2.5}
                                value={payroll.shares.state * 100}
                            />
                        </div>
                        <div className='flex justify-center gap-3'>
                            <Chip classNames={{content: 'font-semibold'}}
                                  className='bg-fiscal-warning text-black'>{t('overview.circularProgress.income')} {toPercentage(payroll.shares.employee)}</Chip>
                            <Chip classNames={{content: 'font-semibold'}}
                                  className='bg-fiscal-primary/90'>{t('overview.circularProgress.taxes')} {toPercentage(payroll.shares.state)}</Chip>
                        </div>
                    </div>
                    <PayRateOverview />
                </div>
            </CardBody>
        </Card>
    )
}

export default FiscalEmployment;