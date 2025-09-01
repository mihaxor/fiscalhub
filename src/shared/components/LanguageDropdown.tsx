'use client';

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import i18nConfig, {languages, LanguageType} from '@/config/i18n';
import {usePathname, useRouter} from 'next/navigation';

const LanguageDropdown = () => {
    const {i18n} = useTranslation();
    const currentLocale = i18n.language as LanguageType;
    const router = useRouter();
    const currentPathname = usePathname();
    const isInitialMount = useRef(true);

    const [selectedKeys, setSelectedKeys] = useState<Set<LanguageType>>(new Set([currentLocale]));
    const selectedValue = useMemo(() => Array.from(selectedKeys)[0], [selectedKeys]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        cookieLanguage(selectedValue);
    }, [selectedValue]);

    const cookieLanguage = (newLocale: LanguageType) => {
        const days = 30;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = date.toUTCString();
        document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

        console.log('Cookie set');

        if (
            currentLocale === i18nConfig.defaultLocale &&
            !i18nConfig.prefixDefault
        ) {
            router.replace('/' + newLocale + currentPathname);
        } else {
            router.replace(
                currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
            );
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button className='capitalize' variant='bordered' radius='sm'>
                    {languages[selectedValue as LanguageType].placeholder}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                aria-label='Single language selection'
                selectedKeys={selectedKeys}
                selectionMode='single'
                variant='flat'
                onSelectionChange={(keys) => setSelectedKeys((new Set(Array.from(keys as Set<LanguageType>))))}>
                {Object.keys(languages).map((lang) =>
                    <DropdownItem key={lang}>{languages[lang as LanguageType].placeholder}</DropdownItem>)}
            </DropdownMenu>
        </Dropdown>
    )
}


export default LanguageDropdown;