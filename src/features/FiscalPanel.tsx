'use client';

import {NumberInput} from '@heroui/number-input';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';
import {Checkbox, CheckboxGroup} from '@heroui/checkbox';
import {Chip} from '@heroui/chip';
import {useMemo, useState} from 'react';
import {useFiscalStore} from '@/shared/store/useFiscalStore';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import {
    CurrencySymbol,
    FiscalCalculationType,
    FiscalPeriodType,
    FiscalType,
    RateType
} from '@/shared/hooks/fiscal.types';
import {StarBorder} from '@/shared/components/StarBorder';
import {useRouter} from 'next/navigation';
import {toAllPeriods} from '@/shared/libs/transform';

const DEFAULT_CURRENCY_OPTIONS = ['RON', 'EUR', 'USD', 'GBP']
    .sort((a, b) => a.localeCompare(b));

const DEFAULT_CALC_TYPES_CHECKED: FiscalCalculationType[] = ['CIM', 'SRL', 'MICRO3'];

const FiscalPanel = () => {
    const router = useRouter();

    const {fiscalInputs, setFiscalInputs} = useFiscalStore();

    const isMobile = useMediaQuery('(max-width: 400px)');

    const [selectedPeriodKeys, setSelectedPeriodKeys] = useState<Set<FiscalPeriodType>>(new Set([fiscalInputs.period]));
    const selectedPeriodValue = useMemo(() => Array.from(selectedPeriodKeys), [selectedPeriodKeys]);

    const [selectedMode, setSelectedMode] = useState(new Set([fiscalInputs.fromType.toUpperCase()]));
    const selectedModeValue = useMemo(() => Array.from(selectedMode)[0], [selectedMode]);

    const [selectedCurrency, setSelectedCurrency] = useState<RateType>(fiscalInputs.currency);
    const [selectedCalcTypes, setSelectedCalcTypes] = useState<FiscalCalculationType[]>(DEFAULT_CALC_TYPES_CHECKED);
    const [value, setValue] = useState<number>(fiscalInputs.value);

    const [isValid, setIsValid] = useState<boolean>(true);

    const checkValidity = (value: number) => !!value && value > 0

    const handleValueChange = (value: number) => {
        setIsValid(checkValidity(value));
        setValue(Number(value));
    }

    const handleFiscalAction = () => {
        if (checkValidity(value)) {
            setFiscalInputs({
                value,
                currency: selectedCurrency,
                period: selectedPeriodValue[0],
                periods: toAllPeriods(value, selectedPeriodValue[0]),
                fromType: selectedModeValue.toLowerCase() as FiscalType,
                calculationType: setSelectedCalcTypes.length ? selectedCalcTypes : []
            });

            router.push('#result');
        } else setIsValid(false);
    }

    return (
        <div className='flex flex-col justify-center items-stretch gap-5 w-full sm:w-lg'>
            <div className='flex flex-row items-start justify-stretch gap-4'>
                <NumberInput
                    isRequired
                    defaultValue={0}
                    variant='flat'
                    size='md'
                    maxLength={7}
                    step={1}
                    errorMessage='Valoarea trebuie sa fie un numar.'
                    isInvalid={!isValid}
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
                                {DEFAULT_CURRENCY_OPTIONS.map((option, key) =>
                                    <option key={key} aria-label={option} value={option}>
                                        {option}
                                    </option>)}
                            </select>
                        </div>
                    }
                    label='Valoare'
                    placeholder={value.toString()}
                    onValueChange={(value) => handleValueChange(value)}
                    // onChange={(e) => setValue(Number((e as ChangeEvent<HTMLInputElement>).target?.value))}
                    // onKeyDown={(e) => {
                    //     if (e.key === 'Enter') {
                    //         e.preventDefault();
                    //         setValue(Number((e.target as HTMLInputElement)?.value));
                    //     }
                    // }}
                />
                <div className='self-start flex items-center gap-4'>/
                    <Dropdown
                        backdrop='blur'
                        classNames={{content: 'min-w-max'}}>
                        <DropdownTrigger>
                            <Button className='w-[140px] sm:w-[180px] h-14' variant='faded' radius='md'>
                                {selectedPeriodValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label='Single selection example'
                            selectionMode='single'
                            variant='flat'
                            onSelectionChange={(keys) => setSelectedPeriodKeys(new Set(Array.from(keys as Set<FiscalPeriodType>)))}>
                            <DropdownItem key='hour'>hour</DropdownItem>
                            <DropdownItem key='day'>day</DropdownItem>
                            <DropdownItem key='month'>month</DropdownItem>
                            <DropdownItem key='year'>year</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <CheckboxGroup
                color='primary'
                defaultValue={selectedCalcTypes}
                orientation='horizontal'
                onValueChange={e => setSelectedCalcTypes(e as FiscalCalculationType[])}
            >
                <div className='flex flex-row items-center justify-between w-full'>
                    <Checkbox size={isMobile ? 'sm' : 'md'} value={FiscalCalculationType.CIM}>CIM</Checkbox>
                    <Checkbox size={isMobile ? 'sm' : 'md'} value={FiscalCalculationType.SRL}>SRL</Checkbox>
                    <Checkbox size={isMobile ? 'sm' : 'md'} value={FiscalCalculationType.MICRO1}>MICRO 1</Checkbox>
                    <Checkbox size={isMobile ? 'sm' : 'md'} value={FiscalCalculationType.MICRO3}>MICRO 3</Checkbox>
                    <Checkbox size={isMobile ? 'sm' : 'md'} value={FiscalCalculationType.PFA}>PFA</Checkbox>
                </div>
            </CheckboxGroup>
            <div className='flex fles-row items-center justify-between w-full gap-4'>
                <Chip variant='flat' radius='md' size='lg' className='text-default-500 text-[15px] h-12'>
                    Se calculeaza din:
                </Chip>
                <Dropdown backdrop='blur' classNames={{content: 'min-w-max'}}>
                    <DropdownTrigger>
                        <Button className='w-full text-default-500' variant='faded' size='lg' radius='md'>
                            {selectedModeValue.toUpperCase()}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label='Single selection example'
                        selectionMode='single'
                        variant='flat'
                        onSelectionChange={(keys) => setSelectedMode(new Set(Array.from(keys as Set<string>)))}>
                        <DropdownItem key='net' textValue='NET'>NET &nbsp;{'->'}&nbsp; GROSS</DropdownItem>
                        <DropdownItem key='gross' textValue='GROSS'>GROSS &nbsp;{'->'}&nbsp; NET</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <StarBorder as='div'>
                <Button className='w-full' variant='solid' color='primary' size='lg' radius='md'
                        onPress={handleFiscalAction}>Calculeaza</Button>
            </StarBorder>
        </div>
    )
}

export default FiscalPanel;