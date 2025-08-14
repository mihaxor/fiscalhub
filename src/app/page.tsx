'use client';

import {Button} from '@heroui/button';
import Header from '@/shared/components/Header';
import {NumberInput} from '@heroui/number-input';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {useMemo, useState} from 'react';
import {Chip} from '@heroui/chip';
import {Input} from '@heroui/input';

const Home = () => {
    const [selectedKeys, setSelectedKeys] = useState(new Set(['NET -> BRUT']));

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
        [selectedKeys],
    );

    return (
        <div
            className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
            <Header />
            <main className='flex flex-col gap-[32px] items-center justify-center'>
                <div className='flex flex-row items-center gap-4'>
                    <NumberInput
                        className='w-full md:w-[230px]'
                        variant='flat'
                        size='md'
                        startContent={
                            <div className='pointer-events-none flex items-center'>
                                <span className='text-default-400 text-small'>$</span>
                            </div>
                        }
                        endContent={
                            <div className='flex items-center'>
                                <label className='sr-only' htmlFor='currency'>
                                    Currency
                                </label>
                                <select
                                    aria-label='Select currency'
                                    className='outline-solid outline-transparent border-0 bg-transparent text-default-400 text-small'
                                    defaultValue='USD'
                                    id='currency'
                                    name='currency'
                                >
                                    <option aria-label='US Dollar' value='USD'>
                                        RON
                                    </option>
                                    <option aria-label='Argentine Peso' value='ARS'>
                                        EUR
                                    </option>
                                    <option aria-label='Euro' value='EUR'>
                                        USD
                                    </option>
                                </select>
                            </div>
                        }
                        label='Valoare'
                        placeholder='0.00'
                    />
                    /
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className='capitalize' variant='bordered' size='lg'>
                                {selectedValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label='Single selection example'
                            selectedKeys='t1'
                            selectionMode='single'
                            variant='flat'
                            onSelectionChange={setSelectedKeys}
                        >
                            <DropdownItem key='hour'>hour</DropdownItem>
                            <DropdownItem key='t2'>daily</DropdownItem>
                            <DropdownItem key='t3'>monthly</DropdownItem>
                            <DropdownItem key='t4'>yearly</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className='flex fles-row items-center gap-4'>
                    Se calculeaza din:
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className='capitalize' variant='ghost' size='lg'>
                                {selectedValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label='Single selection example'
                            selectedKeys='text1'
                            selectionMode='single'
                            variant='flat'
                            onSelectionChange={setSelectedKeys}
                        >
                            <DropdownItem key='text1'>NET - BRUT</DropdownItem>
                            <DropdownItem key='text2'>BRUT - NET</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <Button variant='solid' color='primary' size='lg'>Calculeaza</Button>
            </main>
            <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'>
                <div className='flex flex-col w-full flex-wrap md:flex-nowrap gap-4'>
                    <div className='flex flex-row items-center gap-4'>
                        <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>EUR</Chip>
                        <Input
                            color='primary'
                            size='sm'
                            label="Currency"
                            value="1 RON ~ 5.123123"
                            variant='bordered'
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">€</span>
                                </div>
                            }
                        />
                    </div>
                    <div className='flex flex-row items-center gap-4'>
                        <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>USD</Chip>
                        <Input
                            color='primary'
                            size='sm'
                            label="Currency"
                            value="1 RON ~ 5.123123"
                            variant='bordered'
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">€</span>
                                </div>
                            }
                        />
                    </div>
                    <div className='flex flex-row items-center gap-4'>
                        <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>GBP</Chip>
                        <Input
                            color='primary'
                            size='sm'
                            label="Currency "
                            value="1 RON ~ 5.123123"
                            variant='bordered'
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">€</span>
                                </div>
                            }
                        />
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;