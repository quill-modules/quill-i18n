export type I18nMessageValue = string | { [key: string]: I18nMessageValue };

export interface I18nMessages {
  [locale: string]: {
    [key: string]: I18nMessageValue;
  };
}

export interface I18nOptions {
  /** Current locale */
  locale?: string;
  /** Fallback locale when translation is not found */
  fallbackLocale?: string;
  /** Translation messages for all locales */
  messages?: I18nMessages;
}

export interface LocaleChangeEvent {
  locale: string;
  oldLocale: string;
}

export interface MessagesUpdateEvent {
  locale?: string;
  messages: Record<string, string> | I18nMessages;
}
