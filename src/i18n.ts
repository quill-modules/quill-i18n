import type Quill from 'quill';
import type { I18nMessages, I18nMessageValue, I18nOptions } from './types';
import { I18N_LOCALE_CHANGE, I18N_MESSAGES_UPDATE } from './constants';
import { createReactiveElement, ReactiveTranslation } from './reactive';
import { isObject, isString } from './utils';

export class I18n {
  static DEFAULTS: I18nOptions = {
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: {},
  };

  static resolveOptions(options: Partial<I18nOptions>) {
    return {
      locale: options.locale || I18n.DEFAULTS.locale!,
      fallbackLocale: options.fallbackLocale || I18n.DEFAULTS.fallbackLocale!,
      messages: { ...I18n.DEFAULTS.messages, ...options.messages } as I18nMessages,
      interpolate: options.interpolate,
      getValue: options.getValue,
    };
  }

  quill: Quill;
  options: ReturnType<typeof I18n.resolveOptions>;

  constructor(quill: Quill, options: Partial<I18nOptions> = {}) {
    this.quill = quill;
    this.options = I18n.resolveOptions(options);
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
    const oldLocale = this.options.locale;
    this.options.locale = locale;

    this.quill.emitter.emit(I18N_LOCALE_CHANGE, {
      locale,
      oldLocale,
    });
  }

  getLocale(): string {
    return this.options.locale;
  }

  addMessages(locale: string, messages: Record<string, I18nMessageValue>): void {
    if (!this.options.messages[locale]) {
      this.options.messages[locale] = {};
    }
    Object.assign(this.options.messages[locale], messages);

    this.quill.emitter.emit(I18N_MESSAGES_UPDATE, { locale, messages });
  }

  setMessages(messages: I18nMessages): void {
    this.options.messages = messages;
    this.quill.emitter.emit(I18N_MESSAGES_UPDATE, { messages });
  }

  has(key: string, locale?: string): boolean {
    const targetLocale = locale || this.options.locale;
    return !!this.getValue(this.options.messages[targetLocale], key);
  }

  getAvailableLocales(): string[] {
    return Object.keys(this.options.messages);
  }

  createReactive(key: string, params?: Record<string, any>): ReactiveTranslation {
    return new ReactiveTranslation(this.quill, key, params);
  }

  createReactiveElement(
    tagName: string,
    key: string,
    params?: Record<string, any>,
  ): ReturnType<typeof createReactiveElement> {
    return createReactiveElement(this.quill, tagName, key, params);
  }

  getTranslation(key: string): string | undefined {
    // Try current locale first
    let translation = this.getValue(this.options.messages[this.options.locale], key);

    // Fallback to default locale
    if (!translation && this.options.locale !== this.options.fallbackLocale) {
      translation = this.getValue(this.options.messages[this.options.fallbackLocale], key);
    }

    return translation;
  }

  /**
   * Get value by path, dispatches to options.getValue or getNestedValue
   * @param obj Object to traverse
   * @param path Dot-separated path like 'toolbar.link.prompt'
   */
  getValue(
    obj: { [key: string]: I18nMessageValue } | undefined,
    path: string,
  ): string | undefined {
    if (this.options.getValue) {
      return this.options.getValue.call(this, obj, path);
    }
    return this.getNestedValue(obj, path);
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
   * Interpolate parameters into template string.
   * Uses custom interpolate function from options if provided,
   * otherwise replaces {paramName} with corresponding value.
   */
  interpolate(template: string, params: Record<string, any>): string {
    if (this.options.interpolate) {
      return this.options.interpolate.call(this, template, params);
    }
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
