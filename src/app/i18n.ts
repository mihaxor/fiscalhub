import {createInstance, i18n, Resource} from 'i18next';
import {initReactI18next} from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import i18nConfig, {LanguageType} from '@/config/i18n';

export default async function initTranslations(
    locale: LanguageType,
    namespaces: string[] = ['translation'],
    i18nInstance?: i18n,
    resources?: Resource
) {
    i18nInstance = i18nInstance || createInstance();

    i18nInstance.use(initReactI18next);

    if (!resources) {
        i18nInstance.use(
            resourcesToBackend((language: LanguageType) =>
                import(`@/shared/locales/translations_${language}.json`)
            )
        );
    }

    await i18nInstance.init({
        lng: locale,
        resources,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        defaultNS: namespaces[0],
        fallbackNS: namespaces[0],
        ns: namespaces,
        preload: resources ? [] : i18nConfig.locales
    });

    return {
        i18n: i18nInstance,
        resources: {[locale]: i18nInstance.services.resourceStore.data[locale]},
        t: i18nInstance.t
    };
}