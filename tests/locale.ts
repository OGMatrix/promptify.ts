import { LocaleManager } from '../src/packages/locale/src/main';

const localeManager = new LocaleManager();

console.log(localeManager.getLocales().methods.url.errors.invalid)