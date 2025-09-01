export type LanguageType = 'en' | 'ro';

export const languages: Record<LanguageType, { placeholder: string }> = {
    en: {
        placeholder: 'English',
        // icon: FlagEng
    },
    ro: {
        placeholder: 'Română'
        // icon: FlagRo
    }
}

const i18nConfig = {
    locales: Object.keys(languages),
    defaultLocale: 'en',
    prefixDefault: false
};

export default i18nConfig;