import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';
import zhCN from './locales/zhCN.json';

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('minpasmen-preferred-language') ?? 'en',
  fallbackLocale: localStorage.getItem('minpasmen-preferred-language') ?? 'en',
  messages: {
    en,
    ru,
    'zh-CN': zhCN
  }
});
