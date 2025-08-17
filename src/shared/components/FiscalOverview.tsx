import {Tab, Tabs} from '@heroui/tabs';
import {Card, CardBody} from '@heroui/card';
import {useState} from 'react';
import {Switch} from '@heroui/switch';
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@heroui/table';
import {useFiscalStore} from '@/shared/store/useFiscalStore';

const FiscalOverview = () => {
    const [selected, setSelected] = useState<string | number>('photos');
    const [isVertical, setIsVertical] = useState<boolean>(false);

    const {fiscalInputs} = useFiscalStore();

    console.log('Fiscal Inputs:', fiscalInputs);

    if (fiscalInputs.value === 0) return null;

    return (
        <div className='flex flex-col justify-center items-start w-full sm:w-lg'>
            <Switch className='mb-4' color='secondary' isSelected={isVertical} onValueChange={setIsVertical}>
                Vertical
            </Switch>
            <Tabs aria-label='Options' selectedKey={selected} color='primary' variant='bordered' radius='md'
                  isVertical={isVertical}
                  onSelectionChange={setSelected}
            >
                <Tab key='photos' title='CIM'>
                    <Card radius='md' className='min-h-[350px]'>
                        <CardBody>
                            <Table removeWrapper aria-label='Example static collection table'>
                                <TableHeader>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>ROLE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key='1'>
                                        <TableCell>Tony Reichert</TableCell>
                                        <TableCell>CEO</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                    <TableRow key='2'>
                                        <TableCell>Zoey Lang</TableCell>
                                        <TableCell>Technical Lead</TableCell>
                                        <TableCell>Paused</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key='music' title='SRL'>
                    <Card radius='md' className='min-h-[350px]'>
                        <CardBody>
                            <Table removeWrapper aria-label='Example static collection table'>
                                <TableHeader>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>ROLE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key='1'>
                                        <TableCell>Tony Reichert</TableCell>
                                        <TableCell>CEO</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                    <TableRow key='2'>
                                        <TableCell>Zoey Lang</TableCell>
                                        <TableCell>Technical Lead</TableCell>
                                        <TableCell>Paused</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key='videos' title='Micro 3'>
                    <Card radius='md' className='min-h-[350px]'>
                        <CardBody>
                            <Table removeWrapper aria-label='Example static collection table'>
                                <TableHeader>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>ROLE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key='1'>
                                        <TableCell>Tony Reichert</TableCell>
                                        <TableCell>CEO</TableCell>
                                        <TableCell>Active</TableCell>
                                    </TableRow>
                                    <TableRow key='2'>
                                        <TableCell>Zoey Lang</TableCell>
                                        <TableCell>Technical Lead</TableCell>
                                        <TableCell>Paused</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

export default FiscalOverview;