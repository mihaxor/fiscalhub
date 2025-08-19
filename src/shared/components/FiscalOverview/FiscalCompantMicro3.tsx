import {Card, CardBody} from '@heroui/card';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import React from 'react';

const FiscalCompanyMicro3 = () => {

    return (
        <Card radius='md' className='min-h-[350px] min-w-[500px]'>
            <CardBody>
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
                            <TableCell>test</TableCell>
                            <TableCell>test</TableCell>
                            <TableCell>test</TableCell>
                        </TableRow>
                        <TableRow key='2'>
                            <TableCell>TEST</TableCell>
                            <TableCell>test</TableCell>
                            <TableCell>Technical Lead</TableCell>
                            <TableCell>Paused</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    )
}

export default FiscalCompanyMicro3;