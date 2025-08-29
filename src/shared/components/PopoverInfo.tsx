import {InfoIcon} from '@heroui/shared-icons';
import React from 'react';
import {Popover, PopoverContent, PopoverTrigger} from '@heroui/popover';

type InfoTooltipProps = {
    popoverText: string;
    text: string;
}

const PopoverInfo: React.FC<InfoTooltipProps> = ({popoverText, text}) =>
    (<div className='flex gap-2'>
        {text}
        <Popover showArrow
                 backdrop='opaque'
                 placement='right'
                 classNames={{
                     base: [
                         'before:bg-default-400',
                     ],
                     content: [
                         'px-3 border border-default-200',
                         'bg-linear-to-br from-white to-default-300',
                         'dark:from-default-100 dark:to-default-50'
                     ]
                 }}>
            <PopoverTrigger>
                <InfoIcon fontSize={21} className='focus:outline-none' />
            </PopoverTrigger>
            <PopoverContent>
                <div className='px-1 py-2'>
                    <div className='text-small font-bold'>{text}</div>
                    <div className='text-tiny'>{popoverText}</div>
                </div>
            </PopoverContent>
        </Popover>
    </div>)

export default PopoverInfo;