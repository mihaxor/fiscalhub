import {NumberInput} from '@heroui/number-input';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';
import {Checkbox} from '@heroui/checkbox';
import {Chip} from '@heroui/chip';
import {useContext, useMemo, useState} from 'react';
import {RatesContext} from '@/shared/hooks/useRates';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import {ArrowRight} from 'lucide-react';

const FiscalPanel = () => {
    const {reFetch} = useContext(RatesContext);
    const isMobile = useMediaQuery('(max-width: 400px)');

    const [selectedKeys, setSelectedKeys] = useState(new Set(['monthly']));
    const selectedValue = useMemo(() => Array.from(selectedKeys), [selectedKeys]);

    const [selectedMode, setSelectedMode] = useState(new Set(['NET - BRUT']));
    const selectedModeValue = useMemo(() => Array.from(selectedMode), [selectedMode]);

    return (
        <div className='flex flex-col justify-center items-stretch gap-5 w-full sm:w-lg'>
            <div className='flex flex-row items-center justify-stretch gap-4'>
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
                <Dropdown backdrop='blur'>
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
                        onSelectionChange={(keys) => setSelectedKeys(new Set(Array.from(keys as Set<string>)))}
                    >
                        <DropdownItem key='hour'>hour</DropdownItem>
                        <DropdownItem key='daily'>daily</DropdownItem>
                        <DropdownItem key='monthly'>monthly</DropdownItem>
                        <DropdownItem key='yearly'>yearly</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className='flex flex-row items-center justify-between w-full'>
                <Checkbox size={isMobile ? 'sm' : 'md'} defaultSelected>CIM</Checkbox>
                <Checkbox size={isMobile ? 'sm' : 'md'} defaultSelected>SRL</Checkbox>
                <Checkbox size={isMobile ? 'sm' : 'md'} isDisabled>MICRO 1</Checkbox>
                <Checkbox size={isMobile ? 'sm' : 'md'} defaultSelected>MICRO 3</Checkbox>
                <Checkbox size={isMobile ? 'sm' : 'md'} defaultSelected>PFA</Checkbox>
            </div>
            <div className='flex fles-row items-center justify-between w-full gap-4'>
                <Chip variant='flat' radius='md' size='lg' className='text-default-500 h-12'>
                    Se calculeaza din:
                </Chip>
                <Dropdown backdrop='blur' isDisabled={false}>
                    <DropdownTrigger>
                        <Button className='capitalize w-full text-default-500' variant='faded' size='lg' radius='md'>
                            {selectedModeValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label='Single selection example'
                        selectedKeys='text1'
                        selectionMode='single'
                        variant='flat'
                        onSelectionChange={(keys) => setSelectedMode(new Set(Array.from(keys as Set<string>)))}
                    >
                        <DropdownItem key='NET - BRUT'>NET - BRUT</DropdownItem>
                        <DropdownItem key='BRUT - NET'>BRUT - NET</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Button variant='solid' color='primary' size='lg' onPress={() => reFetch()}>Calculeaza</Button>
        </div>
    )
}

export default FiscalPanel;