import {NumberInput} from '@heroui/number-input';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';
import {Checkbox} from '@heroui/checkbox';
import {Chip} from '@heroui/chip';
import {useMemo, useState} from 'react';

const FiscalPanel = () => {
    const [selectedKeys, setSelectedKeys] = useState(new Set(['NET -> BRUT']));

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
        [selectedKeys],
    );

    return (
        <div className='flex flex-col justify-center items-stretch gap-5 w-lg'>
            <div className='flex flex-row items-center justify-stretch gap-4 w-full'>
                <NumberInput
                    className='w-full md:w-min-[230px]'
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
                        <Button className='capitalize w-[300px] h-14' variant='faded' radius='md'>
                            {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label='Single selection example'
                        selectedKeys='t1'
                        selectionMode='single'
                        variant='flat'
                        // onSelectionChange={setSelectedKeys}
                    >
                        <DropdownItem key='hour'>hour</DropdownItem>
                        <DropdownItem key='t2'>daily</DropdownItem>
                        <DropdownItem key='t3'>monthly</DropdownItem>
                        <DropdownItem key='t4'>yearly</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className='flex flex-row items-center justify-between w-full'>
                <Checkbox defaultSelected>CIM</Checkbox>
                <Checkbox defaultSelected>SRL</Checkbox>
                <Checkbox isDisabled>MICRO 1</Checkbox>
                <Checkbox defaultSelected>MICRO 3</Checkbox>
                <Checkbox defaultSelected>PFA</Checkbox>
            </div>
            <div className='flex fles-row items-center justify-between w-full gap-4'>
                <Chip variant='flat' radius='md' size='lg' className='text-default-500 h-12'>
                    Se calculeaza din:
                </Chip>
                <Dropdown isDisabled={false}>
                    <DropdownTrigger>
                        <Button className='capitalize w-full text-default-500' variant='faded' size='lg' radius='md'>
                            {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label='Single selection example'
                        selectedKeys='text1'
                        selectionMode='single'
                        variant='flat'
                        // onSelectionChange={setSelectedKeys}
                    >
                        <DropdownItem key='text1'>NET - BRUT</DropdownItem>
                        <DropdownItem key='text2'>BRUT - NET</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Button variant='solid' color='primary' size='lg'>Calculeaza</Button>
        </div>
    )
}

export default FiscalPanel;