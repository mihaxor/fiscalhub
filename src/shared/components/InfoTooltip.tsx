import {Tooltip} from '@heroui/tooltip';
import {InfoIcon} from '@heroui/shared-icons';
import React from 'react';

type InfoTooltipProps = {
    popoverText: string;
    text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({popoverText, text}) =>
    (
        <div className='flex gap-2'>
            {text}
            <Tooltip content={`${popoverText} (${text})`} placement='right'
                     showArrow
                     classNames={{
                         base: ['before:bg-neutral-400 dark:before:bg-white'],
                         content: ['py-2 px-4 shadow-xl', 'text-black bg-linear-to-br from-white to-neutral-400'],
                     }}
            >
                <InfoIcon fontSize={21} />
            </Tooltip>
        </div>
    )

export default InfoTooltip;