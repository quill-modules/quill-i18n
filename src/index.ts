import type { LocaleChangeEvent, MessagesUpdateEvent } from './types';

export {
  I18N_LOCALE_CHANGE,
  I18N_MESSAGES_UPDATE,
} from './constants';
export { createI18nToolbarHandlers } from './helpers/toolbar-handlers';
export {
  enableToolbarI18nAutoUpdate,
  updateToolbarI18n,
} from './helpers/toolbar-i18n';
export { default, I18n } from './i18n';
export { createReactiveElement, ReactiveTranslation } from './reactive';
export type {
  I18nMessages,
  I18nMessageValue,
  I18nOptions,
  LocaleChangeEvent,
  MessagesUpdateEvent,
} from './types';

declare module 'quill/core/quill.js' {
  interface Quill {
    on: {
      (event: 'i18n-locale-change', handler: (data: LocaleChangeEvent) => void): any;
      (event: 'i18n-messages-update', handler: (data: MessagesUpdateEvent) => void): any;
    };
    off: {
      (event: 'i18n-locale-change', handler: (data: LocaleChangeEvent) => void): any;
      (event: 'i18n-messages-update', handler: (data: MessagesUpdateEvent) => void): any;
    };
    once: {
      (event: 'i18n-locale-change', handler: (data: LocaleChangeEvent) => void): any;
      (event: 'i18n-messages-update', handler: (data: MessagesUpdateEvent) => void): any;
    };
  }
}
