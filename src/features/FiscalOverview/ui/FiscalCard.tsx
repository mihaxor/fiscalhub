import React, {memo} from 'react';
import {Card, CardBody} from '@heroui/card';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import {FiscalCalculationType, FiscalCompanyResult, FiscalPayrollResult, Taxes} from '@/shared/hooks/fiscal.types';
import {CircularProgress} from '@heroui/progress';
import {Chip} from '@heroui/chip';
import {toPercentage} from '@/shared/libs/transform';
import PayRateOverview from '@/features/PayRateOverview';
import {useTheme} from 'next-themes';
import {useTranslation} from 'react-i18next';
import {useTableOrganizer} from '@/features/FiscalOverview/hooks/useTableOrganizer';

const FiscalCard: React.FC<{
    calcType: FiscalCalculationType,
    taxes: Taxes
    handler: FiscalPayrollResult | FiscalCompanyResult,
    isMobile: boolean
}> = ({calcType, taxes, handler, isMobile}) => {
    const {theme} = useTheme();
    const {t} = useTranslation();
    const {getTableStyle} = useTableOrganizer(taxes, t);

    const getShares = (type: FiscalCalculationType) => {
        return type === FiscalCalculationType.CIM ? (handler as FiscalPayrollResult).shares :
            (handler as FiscalCompanyResult).result[type]?.shares;
    }

    return (
        <Card radius='md' classNames={{base: 'bg-[unset] shadow-none'}}>
            <CardBody
                className='flex flex-row flex-wrap-reverse lg:flex-nowrap justify-center items-stretch p-0.5 gap-3 lg:gap-10'>
                <div>
                    {getTableStyle(calcType, handler, isMobile)
                        .map((table, index) =>
                            <Table key={index} layout='auto'
                                   isCompact={false}
                                   aria-label={`Table for ${table.header.columns[0]}`}
                                   className='mb-3 lg:w-150 xl:w-3xl'>
                                <TableHeader>
                                    {table.header.columns.map((column, index) => (
                                        <TableColumn key={index}
                                                     className={table.header.className}
                                                     width={index === 0 ? 340 : 100}>{column} </TableColumn>))}
                                </TableHeader>
                                <TableBody>
                                    {table.rows.map((row, index) => (
                                        <TableRow key={index} className={row.className}>
                                            {row.cells.map((cell, cellIndex) => (
                                                <TableCell key={cellIndex}>{cell}</TableCell>))}
                                        </TableRow>))}
                                </TableBody>
                            </Table>)}
                    {calcType === FiscalCalculationType.CIM &&
                        <div className='px-10 text-small text-center'>{t('overview.employment.summary.netPaymentText')}
                            <span
                                className='text-fiscal-warning'> {(handler as FiscalPayrollResult).net.lei} lei</span>, {t('overview.employment.summary.employerSpendsText')}
                            <span
                                className='text-fiscal-primary'> {(handler as FiscalPayrollResult).totalEmployerCost.lei} lei</span>
                        </div>}
                </div>
                <div className='w-full md:w-2xl lg:w-sm flex flex-col justify-evenly gap-3'>
                    <div className='m-2 lg:m-20 flex flex-row lg:flex-col items-center justify-center gap-4'>
                        <div>
                            <CircularProgress
                                aria-label='Circle Taxes Percentage'
                                classNames={{
                                    svg: 'w-40 h-40 drop-shadow-lg',
                                    indicator: 'stroke-primary stroke-[2.9] [transition-duration:8s] [transition-timing-function:ease-out] [filter:brightness(1.1)]',
                                    track: 'stroke-warning/95 stroke-[1.5]',
                                    value: `text-2xl font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`,
                                }}
                                showValueLabel={true}
                                value={getShares(calcType)!.taxes * 100}
                            />
                        </div>
                        <div className='flex justify-center gap-3'>
                            <Chip classNames={{content: 'font-semibold'}}
                                  className='bg-fiscal-warning/95 text-black'>{t('overview.circularProgress.income')} {toPercentage(getShares(calcType)!.income)}</Chip>
                            <Chip classNames={{content: 'font-semibold'}}
                                  className='bg-fiscal-primary/90'>{t('overview.circularProgress.taxes')} {toPercentage(getShares(calcType)!.taxes)}</Chip>
                        </div>
                    </div>
                    <PayRateOverview />
                </div>
            </CardBody>
        </Card>
    );
}

export default memo(FiscalCard);