import React from 'react';
import FlagEn from '@/shared/components/Flags/FlagEn';
import FlagRo from '@/shared/components/Flags/FlagRo';

export type LanguageType = 'en' | 'ro';

export const languages: Record<LanguageType, {
    placeholder: string,
    icon: React.FC
}> = {
    en: {
        placeholder: 'English',
        icon: FlagEn
    },
    ro: {
        placeholder: 'Romanian',
        icon: FlagRo
    }
}

const i18nConfig = {
    locales: Object.keys(languages),
    defaultLocale: 'en',
    prefixDefault: false
};

export default i18nConfig;