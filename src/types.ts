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
  /** Custom interpolate function to replace the built-in {paramName} syntax */
  interpolate?: (template: string, params: Record<string, any>) => string;
}

export interface LocaleChangeEvent {
  locale: string;
  oldLocale: string;
}

export interface MessagesUpdateEvent {
  locale?: string;
  messages: Record<string, string> | I18nMessages;
}
