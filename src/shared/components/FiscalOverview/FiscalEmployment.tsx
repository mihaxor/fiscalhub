import React from 'react';
import {Card, CardBody} from '@heroui/card';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import {CurrencySymbol, FiscalPayrollResult, Taxes} from '@/shared/hooks/fiscal.types';
import {CircularProgress} from '@heroui/progress';

type FiscalPayroll = FiscalPayrollResult & {
    symbol: CurrencySymbol
}

type TableOrganizer = {
    header: (string | null)[];
    rows: {
        cells: (string | number | null)[];
        className?: string;
    }[];
}

const TABLE_ORGANIZER = (payroll: FiscalPayroll, taxes: Taxes): TableOrganizer[] => {

    const transformToRo = (value: number, decimals: number = 0): string => {
        return new Intl.NumberFormat('ro-RO', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    };

    const toPercentage = (value: number): string => `${(value * 100)}%`;

    const verifyNetType = (value: string) =>
        value === 'net' ? 'bg-fiscal-warning text-black [&>td]:font-semibold [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md' : 'text-fiscal-primary [&>td]:font-bold';

    const verifyGrossType = (value: string) =>
        value === 'gross' ? 'bg-fiscal-warning text-black [&>td]:font-semibold [&>td:first-child]:rounded-l-md [&>td:last-child]:rounded-r-md' : 'text-fiscal-primary [&>td]:font-bold';

    return [
        {
            header: ['ANGAJAT', null, 'RON', `VALUTA ${payroll.symbol}`],
            rows: [
                {
                    cells: ['Salariu Brut', null, transformToRo(payroll.gross.lei), transformToRo(payroll.gross.currency, 2)],
                    className: verifyNetType(payroll.inputs.fromType)
                },
                {cells: ['Asigurari Sociale (CAS)', toPercentage(taxes.cas), transformToRo(payroll.cas.lei), transformToRo(payroll.cas.currency, 2)]},
                {cells: ['Asigurari Sociale de Sanatate (CASS)', toPercentage(taxes.cass), transformToRo(payroll.cass.lei), transformToRo(payroll.cass.currency, 2)]},
                {cells: ['Deducere personala (DP)', null, 0, 0]},
                {cells: ['Impozit pe venit (IV)', toPercentage(taxes.iv), transformToRo(payroll.iv.lei), transformToRo(payroll.iv.currency, 2)]},
                {
                    cells: ['Salariu Net', null, transformToRo(payroll.net.lei), transformToRo(payroll.net.currency, 2)],
                    className: verifyGrossType(payroll.inputs.fromType)
                }
            ]
        },
        {
            header: ['ANGAJATOR', null, 'RON', 'VALUTA'],
            rows: [
                {cells: ['Contributie Asiguratorie pentru Munca (CAM)', toPercentage(taxes.cam), transformToRo(payroll.cam.lei), transformToRo(payroll.cam.currency, 2)]},
                {cells: ['Salariu Complet', null, transformToRo(payroll.totalEmployerCost.lei), transformToRo(payroll.totalEmployerCost.currency, 2)]}
            ]
        },
        {
            header: ['TOTAL TAXE', null, 'RON', 'VALUTA'],
            rows: [
                {cells: ['Angajatul plateste statului', null, transformToRo(payroll.taxesEmployee.lei), transformToRo(payroll.taxesEmployee.currency, 2)]},
                {cells: ['Angajatorul plateste statului', null, transformToRo(payroll.taxesEmployer.lei), transformToRo(payroll.taxesEmployer.currency, 2)]},
                {
                    cells: ['Total taxe incasate de stat', null, transformToRo(payroll.taxesState.lei), transformToRo(payroll.taxesState.currency, 2)],
                    className: 'text-fiscal-primary [&>td]:font-bold'
                }
            ]
        }
    ]
};

const FiscalEmployment: React.FC<{
    payroll: FiscalPayrollResult & { symbol: CurrencySymbol },
    taxes: Taxes
}> = ({payroll, taxes}) => {

    console.log('FiscalEmployment Component Rendered', payroll, taxes);

    return (
        <Card radius='md'>
            <CardBody className='flex flex-row flex-wrap-reverse justify-center items-center gap-4'>
                <div>
                    {TABLE_ORGANIZER(payroll, taxes).map((table, index) => (
                        <Table key={index} removeWrapper layout='auto' isCompact={false}
                               aria-label={`Table for ${table.header[0]}`}>
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
                </div>
                {/*<Divider className='h-[200px]' orientation='vertical' />*/}
                <div className='m-10 lg:m-20'>
                    <CircularProgress
                        aria-label='Circle Taxes Percentage'
                        classNames={{
                            svg: 'w-40 h-40 drop-shadow-lg',
                            indicator: 'stroke-warning',
                            track: 'stroke-white/10',
                            value: 'text-2xl font-semibold text-white',
                        }}
                        showValueLabel={true}
                        strokeWidth={3}
                        value={payroll.shares.state * 100}
                    />

                </div>
            </CardBody>
        </Card>
    )
}

export default FiscalEmployment;