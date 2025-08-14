'use client';

import {Divider} from '@heroui/divider';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;

    return (
        <footer className='absolute bottom-0 w-full mb-8'>
            <div className='w-full flex flex-col justify-center items-center'>
                <Divider className='w-[95%]' />
                <div className='w-[95%] flex items-center space-x-2 m-4 md:mb-0'>
                    <span className='text-xl font-bold'>Fiscal Hub</span>
                    <span className='text-xs font-bold text-primary'>v{appVersion}</span>
                </div>
            </div>
            <div className='w-full flex flex-col justify-center'>
                <div className='w-[95%]'>
                </div>
                <div className='text-center text-sm'>
                    <strong>© <a href='https://linkedin.com/in/catalin-glavan'>
                        Catalin Glavan</a> {currentYear} | React Developer |
                        <a href='mailto:glmihaicata@gmail.com'> glmihaicata@gmail.com</a></strong> <br />
                    All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;