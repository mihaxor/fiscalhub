'use client';

import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {Button} from '@heroui/button';
import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {languageResources, LanguageType} from '@/config/i18n';

const LanguageSwitch = () => {
    const {i18n, t} = useTranslation();
    // const searchParams = useSearchParams();

    const [selectedKeys, setSelectedKeys] = useState<Set<LanguageType | ''>>(new Set(['']));
    const selectedValue = useMemo(() => Array.from(selectedKeys)[0], [selectedKeys],);

    useEffect(() => {
        initLanguage();
    }, []);

    const initLanguage = () => {
        const currentLang = i18n.language as LanguageType;

        if (currentLang) changeLanguage(new Set([currentLang]));
    };

    const changeLanguage = (newValue: Set<LanguageType>) => {
        setSelectedKeys(new Set(Array.from(newValue)));

        // if (searchParams.endsWith('/ui/keys')) i18n.changeLanguage('cimode');
        // else
        i18n.changeLanguage(Array.from(selectedKeys)[0]);
    };

    const getLang = (lang: string) => languageResources[lang] ? languageResources[lang] : languageResources.ro;
    const currentLang = getLang(selectedValue);
    const listLanguages = Object.entries(languageResources).map(([key, value]) => ({key, ...value}));

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button className='capitalize' variant='bordered' radius='sm'>
                    {currentLang.placeholder}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                aria-label='Single language selection'
                selectedKeys={selectedKeys}
                selectionMode='single'
                variant='flat'
                onSelectionChange={(keys) => changeLanguage((new Set(Array.from(keys as Set<LanguageType>))))}
            >
                {listLanguages.map((language) =>
                    <DropdownItem key={language.key}>{language.placeholder}</DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>
    )
}


export default LanguageSwitch;