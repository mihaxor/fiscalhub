import {NumberInput} from '@heroui/number-input';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';
import {Checkbox} from '@heroui/checkbox';
import {Chip} from '@heroui/chip';
import {useContext, useMemo, useState} from 'react';
import {RatesContext} from '@/shared/hooks/useRates';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import useFiscalPayroll from '@/shared/hooks/useFiscalPayroll';
import {CurrencySymbol, FiscalType, RateType} from '@/shared/hooks/fiscal.types';
import useCurrency from '@/shared/hooks/useCurrency';

const INITIAL_CURRENCY_OPTIONS = ['RON', 'EUR', 'USD', 'GBP']
    .sort((a, b) => a.localeCompare(b));

const FiscalPanel = () => {
    const {data: rates} = useContext(RatesContext);
    const isMobile = useMediaQuery('(max-width: 400px)');

    const [selectedPeriodKeys, setSelectedPeriodKeys] = useState(new Set(['monthly']));
    const selectedPeriodValue = useMemo(() => Array.from(selectedPeriodKeys), [selectedPeriodKeys]);

    const [selectedMode, setSelectedMode] = useState(new Set(['NET']));
    const selectedModeValue = useMemo(() => Array.from(selectedMode)[0], [selectedMode]);

    const {calcPayroll} = useFiscalPayroll();
    const {verifyCurrency} = useCurrency(rates);
    const [selectedCurrency, setSelectedCurrency] = useState<RateType>('RON');
    const [value, setValue] = useState<number>(0.00);

    return (
        <div className='flex flex-col justify-center items-stretch gap-5 w-full sm:w-lg'>
            <div className='flex flex-row items-center justify-stretch gap-4'>
                <NumberInput
                    className='w-full md:w-min-[230px]'
                    variant='flat'
                    size='md'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>
                                {CurrencySymbol[selectedCurrency as keyof typeof CurrencySymbol]}
                            </span>
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
                                defaultValue={selectedCurrency}
                                id='currency'
                                name='currency'
                                onChange={(e) => setSelectedCurrency(e.target.value as RateType)}
                            >
                                {INITIAL_CURRENCY_OPTIONS.map((option, key) => {
                                    return (
                                        <option key={key} aria-label={option} value={option}>
                                            {option}
                                        </option>)
                                })}
                            </select>
                        </div>
                    }
                    label='Valoare'
                    placeholder={value.toString()}
                    onValueChange={(value) => setValue(Number(value))}
                    // onChange={(e) => setValue(Number((e as ChangeEvent<HTMLInputElement>).target?.value))}
                    // onKeyDown={(e) => {
                    //     if (e.key === 'Enter') {
                    //         e.preventDefault();
                    //         setValue(Number((e.target as HTMLInputElement)?.value));
                    //     }
                    // }}
                />
                /
                <Dropdown backdrop='blur'>
                    <DropdownTrigger>
                        <Button className='w-[300px] h-14' variant='faded' radius='md'>
                            {selectedPeriodValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label='Single selection example'
                        selectedKeys='t1'
                        selectionMode='single'
                        variant='flat'
                        onSelectionChange={(keys) => setSelectedPeriodKeys(new Set(Array.from(keys as Set<string>)))}
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
                        <Button className='w-full text-default-500' variant='faded' size='lg' radius='md'>
                            {selectedModeValue.toUpperCase()}
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
                        <DropdownItem key='net' textValue='NET'>NET &nbsp;{'->'}&nbsp; BRUT</DropdownItem>
                        <DropdownItem key='gross' textValue='BRUT'>BRUT &nbsp;{'->'}&nbsp; NET</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Button variant='solid' color='primary' size='lg' onPress={() => {
                console.log(calcPayroll({
                    fromType: selectedModeValue.toLowerCase() as FiscalType,
                    value,
                    rate: verifyCurrency(selectedCurrency, rates)?.rate
                }))
            }}>Calculeaza</Button>
        </div>
    )
}

export default FiscalPanel;