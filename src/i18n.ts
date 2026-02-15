import type Quill from 'quill';
import type { I18nMessages, I18nMessageValue, I18nOptions } from './types';
import { I18N_LOCALE_CHANGE, I18N_MESSAGES_UPDATE } from './constants';
import { isObject, isString } from './utils';

export class I18n {
  static DEFAULTS: I18nOptions = {
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: {},
  };

  quill: Quill;
  locale: string;
  fallbackLocale: string;
  messages: I18nMessages;

  constructor(quill: Quill, options: Partial<I18nOptions> = {}) {
    this.quill = quill;
    this.locale = options.locale || I18n.DEFAULTS.locale!;
    this.fallbackLocale = options.fallbackLocale || I18n.DEFAULTS.fallbackLocale!;
    this.messages = {
      ...I18n.DEFAULTS.messages,
      ...options.messages,
    };
  }

  /**
   * Get translation by key
   * Supports nested path access like 'toolbar.link.prompt'
   * @param key Translation key (dot-separated path)
   * @param params Parameters for interpolation
   * @param defaultValue Default value if translation not found
   */
  t(key: string, params?: Record<string, any>, defaultValue?: string): string {
    // Validate key parameter
    if (!key || !isString(key)) {
      return defaultValue || '';
    }

    let translation = this.getTranslation(key);

    if (!translation) {
      translation = defaultValue || key;
    }

    if (params) {
      translation = this.interpolate(translation, params);
    }

    return translation;
  }

  setLocale(locale: string): void {
    const oldLocale = this.locale;
    this.locale = locale;

    this.quill.emitter.emit(I18N_LOCALE_CHANGE, {
      locale,
      oldLocale,
    });
  }

  getLocale(): string {
    return this.locale;
  }

  addMessages(locale: string, messages: Record<string, I18nMessageValue>): void {
    if (!this.messages[locale]) {
      this.messages[locale] = {};
    }
    Object.assign(this.messages[locale], messages);

    this.quill.emitter.emit(I18N_MESSAGES_UPDATE, { locale, messages });
  }

  setMessages(messages: I18nMessages): void {
    this.messages = messages;
    this.quill.emitter.emit(I18N_MESSAGES_UPDATE, { messages });
  }

  has(key: string, locale?: string): boolean {
    const targetLocale = locale || this.locale;
    return !!this.getNestedValue(this.messages[targetLocale], key);
  }

  getAvailableLocales(): string[] {
    return Object.keys(this.messages);
  }

  getTranslation(key: string): string | undefined {
    // Try current locale first
    let translation = this.getNestedValue(this.messages[this.locale], key);

    // Fallback to default locale
    if (!translation && this.locale !== this.fallbackLocale) {
      translation = this.getNestedValue(this.messages[this.fallbackLocale], key);
    }

    return translation;
  }

  /**
   * Get nested value from object using dot-separated path
   * @param obj Object to traverse
   * @param path Dot-separated path like 'toolbar.link.prompt'
   */
  getNestedValue(
    obj: { [key: string]: I18nMessageValue } | undefined,
    path: string,
  ): string | undefined {
    if (!obj || !path || !isString(path)) return undefined;

    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
      if (isObject(current) && key in current) {
        current = current[key];
      }
      else {
        return undefined;
      }
    }

    if (isString(current)) return current;
    // Fallback to empty string
    if (isObject(current) && '' in current) {
      const fallback = current[''];
      return isString(fallback) ? fallback : undefined;
    }
    return undefined;
  }

  /**
   * Interpolate parameters into template string
   * Replaces {paramName} with corresponding value
   */
  interpolate(template: string, params: Record<string, any>): string {
    return template.replaceAll(/\{(\w+)\}/g, (match, key) => {
      // Note: Uses `!= null` (loose equality) instead of `!== undefined` to treat both
      // `null` and `undefined` as "missing values". This matches the behavior of popular
      // i18n libraries like Vue I18n, where null values do not replace placeholders.
      //
      // Example:
      // - t('Hello, {name}!', { name: 'John' }) => 'Hello, John!'
      // - t('Hello, {name}!', { name: null }) => 'Hello, {name}!'
      // - t('Hello, {name}!', {}) => 'Hello, {name}!'
      return params[key] != null ? String(params[key]) : match;
    });
  }
}

export default I18n;
