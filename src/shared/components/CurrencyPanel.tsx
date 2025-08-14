import {Chip} from '@heroui/chip';
import {Input} from '@heroui/input';

const CurrencyPanel = ({}) => {

    return (
        <div className='flex flex-col justify-between gap-4 w-[450px]'>
            <div className='flex flex-row items-center gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    label='Valoare'
                    value='1'
                    variant='bordered'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>RON</span>
                        </div>
                    }
                />
                <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>EUR</Chip>
                <Input
                    color='primary'
                    size='sm'
                    label='Currency'
                    value='5.123123'
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>€</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row items-center gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    label='Valoare'
                    value='1'
                    variant='bordered'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>RON</span>
                        </div>
                    }
                />
                <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>USD</Chip>
                <Input
                    color='primary'
                    size='sm'
                    label='Currency'
                    value='5.123123'
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>$</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row items-center gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    label='Valoare'
                    value='1'
                    variant='bordered'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>RON</span>
                        </div>
                    }
                />
                <Chip color='primary' variant='bordered' radius='sm' size='lg' className='h-12'>GBP</Chip>
                <Input
                    color='primary'
                    size='sm'
                    label='Currency'
                    value='5.123123'
                    variant='faded'
                    isReadOnly={true}
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>£</span>
                        </div>
                    }
                />
            </div>
            <div className='flex flex-row items-center gap-4 w-full'>
                <Input
                    color='primary'
                    size='sm'
                    label='Valoare'
                    value='1'
                    variant='bordered'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>€</span>
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
                />
                <Input
                    color='primary'
                    size='sm'
                    label='Currency'
                    value='5.123123'
                    variant='bordered'
                    startContent={
                        <div className='pointer-events-none flex items-center'>
                            <span className='text-default-400 text-small'>RON</span>
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
                />
            </div>
        </div>
    )
}

export default CurrencyPanel;