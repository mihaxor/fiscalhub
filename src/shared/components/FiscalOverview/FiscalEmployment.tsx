import React from 'react';
import {Card, CardBody} from '@heroui/card';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import {FiscalPayrollResult, Taxes} from '@/shared/hooks/fiscal.types';
import {CircularProgress} from '@heroui/progress';

type TableOrganizer = {
    header: (string | null)[];
    rows: {
        cells: (string | number | null)[];
    }[];
}

const TABLE_ORGANIZER = (payroll: FiscalPayrollResult, taxes: Taxes): TableOrganizer[] => {
    const toPercentage = (value: number): string => `${(value * 100)}%`;

    return [
        {
            header: ['ANGAJAT', null, 'RON', 'VALUTA'],
            rows: [
                {cells: ['Salariu Brut', null, payroll.gross.lei, payroll.gross.currency.toFixed(2)]},
                {cells: ['Asigurari Sociale (CAS)', toPercentage(taxes.cas), payroll.cas.lei, payroll.cas.currency.toFixed(2)]},
                {cells: ['Asigurari Sociale de Sanatate (CASS)', toPercentage(taxes.cass), payroll.cass.lei, payroll.cass.currency.toFixed(2)]},
                {cells: ['Deducere personala (DP)', null, 0, 0]},
                {cells: ['Impozit pe venit (IV)', toPercentage(taxes.iv), payroll.iv.lei, payroll.iv.currency.toFixed(2)]},
                {cells: ['Salariu Net', null, payroll.net.lei, payroll.net.currency.toFixed(2)]}
            ]
        },
        {
            header: ['ANGAJATOR', null, 'RON', 'VALUTA'],
            rows: [
                {cells: ['Contributie Asiguratorie pentru Munca (CAM)', toPercentage(taxes.cam), payroll.cam.lei, payroll.cam.currency.toFixed(2)]},
                {cells: ['Salariu Complet', null, payroll.totalEmployerCost.lei, payroll.totalEmployerCost.currency.toFixed(2)]},
            ]
        },
        {
            header: ['TOTAL TAXE', null, 'RON', 'VALUTA'],
            rows: [
                {cells: ['Angajatul plateste statului', null, payroll.taxesEmployee.lei, payroll.taxesEmployee.currency.toFixed(2)]},
                {cells: ['Angajatorul plateste statului', null, payroll.taxesEmployer.lei, payroll.taxesEmployer.currency.toFixed(2)]},
                {cells: ['Total taxe incasate de stat', null, payroll.taxesState.lei, payroll.taxesState.currency.toFixed(2)]},
            ]
        }
    ]
};

const FiscalEmployment: React.FC<{ payroll: FiscalPayrollResult, taxes: Taxes }> = ({payroll, taxes}) => {

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
                                    <TableColumn key={index} width={index === 0 ? 340 : 80}>{column} </TableColumn>))}
                            </TableHeader>
                            <TableBody>
                                {table.rows.map((row, index) => (
                                    <TableRow key={index}>
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
                            svg: 'w-36 h-36 drop-shadow-md',
                            indicator: 'stroke-white',
                            track: 'stroke-white/10',
                            value: 'text-3xl font-semibold text-white',
                        }}
                        showValueLabel={true}
                        strokeWidth={4}
                        value={payroll.shares.state * 100}
                    />

                </div>
            </CardBody>
        </Card>
    )
}

export default FiscalEmployment;