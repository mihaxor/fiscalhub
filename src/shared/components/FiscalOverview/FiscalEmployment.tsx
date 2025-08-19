import React from 'react';
import {Card, CardBody} from '@heroui/card';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import {FiscalPayrollResult, Taxes} from '@/shared/hooks/fiscal.types';
import {Divider} from '@heroui/divider';

const TABLE_ORGANIZER = (payroll: FiscalPayrollResult, taxes: Taxes) => ({
    header: ['ANGAJAT', '&nbsp;', 'RON', 'VALUTA'],
    rows: [
        {cells: ['Salariu Brut', '&nbsp;', payroll.gross.lei, payroll.gross.currency]},
        {cells: ['Contribuții Sociale', '25%', '250', 'RON']},
        {cells: ['Impozit pe Venit', '10%', '100', 'RON']},
        {cells: ['Salariu Net', '&nbsp;', '650', 'RON']}
    ]
});

const FiscalEmployment: React.FC<{ payroll: FiscalPayrollResult, taxes: Taxes }> = ({payroll, taxes}) => {

    return (
        <Card radius='md' className='min-h-[350px] min-w-[500px]'>
            <CardBody className='gap-4'>
                <Table removeWrapper aria-label='Example static collection table'>
                    <TableHeader>
                        <TableColumn>ANGAJAT</TableColumn>
                        <TableColumn>&nbsp;</TableColumn>
                        <TableColumn>RON</TableColumn>
                        <TableColumn>VALUTA</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key='1' className='bg-blue-800'>
                            <TableCell>Salariu Brut</TableCell>
                            <TableCell> </TableCell>
                            <TableCell>{payroll.gross.lei}</TableCell>
                            <TableCell>{payroll.gross.currency}</TableCell>
                        </TableRow>
                        <TableRow key='2'>
                            <TableCell> </TableCell>
                            <TableCell>{taxes.cas * 100}%</TableCell>
                            <TableCell>Technical Lead</TableCell>
                            <TableCell>Paused</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Divider />
                <Table removeWrapper aria-label='Example static collection table'>
                    <TableHeader>
                        <TableColumn>ANGAJAT</TableColumn>
                        <TableColumn> </TableColumn>
                        <TableColumn>RON</TableColumn>
                        <TableColumn>VALUTA</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow key='1' className='bg-blue-800'>
                            <TableCell>Salariu Brut</TableCell>
                            <TableCell> </TableCell>
                            <TableCell>{payroll.gross.lei}</TableCell>
                            <TableCell>{payroll.gross.currency}</TableCell>
                        </TableRow>
                        <TableRow key='2'>
                            <TableCell> </TableCell>
                            <TableCell>{taxes.cas * 100}%</TableCell>
                            <TableCell>Technical Lead</TableCell>
                            <TableCell>Paused</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    )
}

export default FiscalEmployment;