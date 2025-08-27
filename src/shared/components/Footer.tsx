'use client';

import {Divider} from '@heroui/divider';
import Image from 'next/image';
import Logo from '../../../public/logo.png';
import ThemeSwitch from '@/shared/components/ThemeSwitch';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;

    return (
        <footer className='w-full mb-8'>
            <div className='w-full flex flex-col justify-center items-center md:mb-2'>
                <Divider />
                <div className='w-full flex items-center justify-center sm:justify-between space-x-2 m-6 md:mb-0'>
                    <div className='inline-flex items-center space-x-2'>
                        <Image loading='lazy' src={Logo} alt={'logo'} width={40} height={40} />
                        <span className='text-xl font-bold'>Fiscal Hub</span>
                        <span className='text-xs font-bold text-primary'>v{appVersion}</span>
                    </div>
                    <ThemeSwitch type='toggle' />
                </div>
            </div>
            <div className='w-full flex flex-col justify-center'>
                <div className='text-center text-sm'>
                    <strong>© {currentYear} <a href='https://linkedin.com/in/catalin-glavan'>Catalin Glavan</a> |
                        <a href='mailto:glmihaicata@gmail.com'> glmihaicata@gmail.com</a></strong> <br />
                    All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;