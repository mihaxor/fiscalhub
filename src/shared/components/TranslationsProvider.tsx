'use client';

import {I18nextProvider} from 'react-i18next';
import initTranslations from '@/app/i18n';
import {createInstance, Resource} from 'i18next';
import React from 'react';
import {LanguageType} from '@/config/i18n';

interface TranslationsProviderProps {
    children: React.ReactNode;
    locale: LanguageType;
    namespaces?: string[];
    resources?: Resource;
}

export const TranslationsProvider: React.FC<TranslationsProviderProps> =
    ({children, locale, namespaces, resources}) => {

        const i18n = createInstance();

        initTranslations(locale, namespaces, i18n, resources);

        return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
    }