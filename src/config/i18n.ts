import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import translationEN from '@/shared/i18n/translations_en.json';
import translationRO from '@/shared/i18n/translations_ro.json';

export type LanguageResourceType = Record<string, {
    placeholder: string
    translation: object
    // icon?: IconType | undefined
}>;

export type LanguageType = 'en' | 'ro';

export const languageResources = {
    en: {
        placeholder: 'English',
        translation: translationEN,
        // icon: FlagEng
    },
    ro: {
        placeholder: 'Romanian',
        translation: translationRO,
        // icon: FlagRo
    }
} as LanguageResourceType;

const initOptions = {
    resources: languageResources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    detection: {
        order: ['queryString', 'cookie', 'localStorage'],
        cache: ['cookie']
    },
    interpolation: {
        escapeValue: false
    }
};

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init(initOptions);
export const i18next = i18n;
export default i18n;
