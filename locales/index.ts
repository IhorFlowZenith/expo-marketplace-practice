import { I18n } from 'i18n-js';
import en from './en.json';
import ua from './ua.json';

export const i18n = new I18n({ en, ua });

i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.enableFallback = true;
