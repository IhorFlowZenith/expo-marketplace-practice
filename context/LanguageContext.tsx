import { i18n } from '@/locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Locale = 'en' | 'ua';

const STORAGE_KEY = '@app_locale';

interface LanguageContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
    locale: 'en',
    setLocale: () => {},
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
            if (saved === 'en' || saved === 'ua') {
                i18n.locale = saved;
                setLocaleState(saved);
            }
        });
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        i18n.locale = newLocale;
        setLocaleState(newLocale);
        AsyncStorage.setItem(STORAGE_KEY, newLocale);
    }, []);

    const t = useCallback(
        (key: string, options?: Record<string, unknown>) => i18n.t(key, options),
        [locale],
    );

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
