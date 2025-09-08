'use client';

import {NumberInput} from '@heroui/number-input';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';
import {Checkbox, CheckboxGroup} from '@heroui/checkbox';
import {Chip} from '@heroui/chip';
import React, {useMemo, useState} from 'react';
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
import {useTranslation} from 'react-i18next';

const DEFAULT_CURRENCY_OPTIONS = ['RON', 'EUR', 'USD', 'GBP']
    .sort((a, b) => a.localeCompare(b));

const DEFAULT_CALC_TYPES_CHECKED: FiscalCalculationType[] = ['CIM', 'MICRO3'];

const FiscalPanel = () => {
    const router = useRouter();

    const {fiscalInputs, setFiscalInputs} = useFiscalStore();

    const isMobile = useMediaQuery('(max-width: 400px)');

    const [selectedPeriodKeys, setSelectedPeriodKeys] = useState<Set<FiscalPeriodType>>(new Set([fiscalInputs.period]));
    const selectedPeriodValue = useMemo(() => Array.from(selectedPeriodKeys), [selectedPeriodKeys]);

    const [selectedMode, setSelectedMode] = useState<Set<FiscalType>>(new Set([fiscalInputs.fromType]));
    const selectedModeValue = useMemo(() => Array.from(selectedMode)[0], [selectedMode]);

    const [selectedCurrency, setSelectedCurrency] = useState<RateType>(fiscalInputs.currency);
    const [selectedCalcTypes, setSelectedCalcTypes] = useState<FiscalCalculationType[]>(DEFAULT_CALC_TYPES_CHECKED);
    const [value, setValue] = useState<number>(fiscalInputs.value);

    const [isValid, setIsValid] = useState<boolean>(true);

    const {t} = useTranslation();

    const checkValidity = (value: number) => !!value && value > 0;

    const orderCalcTypes = (types: FiscalCalculationType[]) => {
        const order = ['CIM', 'SRL', 'MICRO1', 'MICRO3', 'PFA'];

        return types.sort((a, b) => {
            const indexA = order.indexOf(a);
            const indexB = order.indexOf(b);
            return indexA - indexB;
        });
    }

    const handleValueChange = (value: number) => {
        setIsValid(checkValidity(value));
        setValue(Number(value));
    }

    const handleFiscalAction = (e?: React.KeyboardEvent<HTMLInputElement>) => {
        const directValue = e && !Number.isNaN((e.target as HTMLInputElement).value) ?
            Number((e.target as HTMLInputElement).value.replace(/,/g, '')) : value;
        const validity = checkValidity(directValue);

        if (validity) {
            setFiscalInputs({
                value: directValue,
                currency: selectedCurrency,
                period: selectedPeriodValue[0],
                periods: toAllPeriods(directValue, selectedPeriodValue[0]),
                fromType: selectedModeValue.toLowerCase() as FiscalType,
                calculationType: selectedCalcTypes.length ? orderCalcTypes(selectedCalcTypes) : [],
            });
            setIsValid(validity);

            router.push('#result');
        } else setIsValid(false);
    }

    const handleCheckboxKeyDown = (e: React.KeyboardEvent, checkboxValue: FiscalCalculationType) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const isCurrentlySelected = selectedCalcTypes.includes(checkboxValue);
            let newSelectedTypes: FiscalCalculationType[];

            if (isCurrentlySelected)
                newSelectedTypes = selectedCalcTypes.filter(type => type !== checkboxValue);
            else newSelectedTypes = [...selectedCalcTypes, checkboxValue];

            setSelectedCalcTypes(newSelectedTypes);
        }
    };

    return (
        <div className='flex flex-col justify-center items-stretch gap-5 w-full sm:w-lg'>
            <div className='flex flex-row items-start justify-stretch gap-4'>
                <NumberInput
                    isRequired
                    defaultValue={0}
                    variant='flat'
                    size='md'
                    maxLength={7}
                    errorMessage={t('general.inputError')}
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
                    label={t('general.label')}
                    placeholder={value.toString()}
                    onValueChange={(value) => handleValueChange(value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFiscalAction(e)}
                />
                <div className='self-start flex items-center gap-4'>/
                    <Dropdown
                        backdrop='blur'
                        classNames={{content: 'min-w-[115px]'}}>
                        <DropdownTrigger>
                            <Button className='w-[140px] sm:w-[180px] h-14' variant='faded' radius='md'>
                                {t(`general.period.${selectedPeriodValue}`)}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label='Single selection example'
                            selectedKeys={selectedPeriodKeys}
                            selectionMode='single'
                            variant='flat'
                            onSelectionChange={(keys) => setSelectedPeriodKeys(new Set(Array.from(keys as Set<FiscalPeriodType>)))}>
                            <DropdownItem key='hour'>{t('general.period.hour')}</DropdownItem>
                            <DropdownItem key='day'>{t('general.period.day')}</DropdownItem>
                            <DropdownItem key='month'>{t('general.period.month')}</DropdownItem>
                            <DropdownItem key='year'>{t('general.period.year')}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <CheckboxGroup
                color='primary'
                value={selectedCalcTypes}
                orientation='horizontal'
                onValueChange={e => setSelectedCalcTypes(e as FiscalCalculationType[])}>
                <div className='flex flex-row items-center justify-between w-full'>
                    {Object.values(FiscalCalculationType).map((type: FiscalCalculationType, index) =>
                        <Checkbox key={index}
                                  isDisabled={!(type === FiscalCalculationType.MICRO1 || type === FiscalCalculationType.MICRO3 || type === FiscalCalculationType.CIM)}
                                  size={isMobile ? 'sm' : 'md'}
                                  value={type}
                                  onKeyDown={(e) => handleCheckboxKeyDown(e, type)}>
                            {type}
                        </Checkbox>)}
                </div>
            </CheckboxGroup>
            <div className='flex fles-row items-center justify-between w-full gap-4'>
                <Chip variant='flat' radius='md' size='lg' className='text-default-500 text-[15px] h-12'>
                    {t('general.calculationType.label')}
                </Chip>
                <Dropdown backdrop='blur'
                          classNames={{content: 'min-w-[170px]'}}>
                    <DropdownTrigger>
                        <Button className='w-full text-default-500' variant='faded' size='lg' radius='md'>
                            {t(`general.calculationType.${selectedModeValue.toLowerCase()}`)}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label='Single selection example'
                        selectedKeys={selectedMode}
                        selectionMode='single'
                        variant='flat'
                        onSelectionChange={(keys) => setSelectedMode(new Set(Array.from(keys as Set<FiscalType>)))}>
                        <DropdownItem key='net'>{t('general.calculationType.net')}</DropdownItem>
                        <DropdownItem key='gross'>{t('general.calculationType.gross')}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <StarBorder as='div'>
                <Button className='w-full' variant='solid' color='primary' size='lg' radius='md'
                        onPress={() => handleFiscalAction()}>{t('general.calculationBtn')}</Button>
            </StarBorder>
        </div>
    )
}

export default FiscalPanel;