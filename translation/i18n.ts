import AsyncStorage from "@react-native-async-storage/async-storage";

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

const resources = {
    en: {translation: en},
    pt: {translation: pt},
    es: {translation: es},
};

async function getDeviceLanguage() {
    const savedLanguage = await AsyncStorage.getItem('@oasis-language');
    return savedLanguage || Localization.getLocales()[0].languageCode || 'en'
}

export async function changeLanguage(language: string) {
    await AsyncStorage.setItem('@oasis-language', language);
    i18n.changeLanguage(language);
}

getDeviceLanguage().then((language) => {
    i18n
        .use(initReactI18next)
        .init({
            compatibilityJSON: 'v3',
            resources,
            lng: language,
            fallbackLng: 'en', // fallback language

            interpolation: {
                escapeValue: false,
            },
        });
})

export default i18n;
