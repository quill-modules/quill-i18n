import type Quill from 'quill';
import type { I18n } from './i18n';
import { I18N_LOCALE_CHANGE, I18N_MESSAGES_UPDATE } from './constants';

/**
 * Reactive Translation Helper
 * Automatically updates when locale changes
 */
export class ReactiveTranslation {
  quill: Quill;
  i18n: I18n;
  element?: HTMLElement;
  key: string;
  params?: Record<string, any>;
  boundUpdate: () => void;
  currentValue: string = '';

  constructor(
    quill: Quill,
    key: string,
    params?: Record<string, any>,
  ) {
    this.quill = quill;
    this.i18n = quill.getModule('i18n') as I18n;
    this.key = key;
    this.params = params;

    this.boundUpdate = () => this.update();
    this.quill.on(I18N_LOCALE_CHANGE, this.boundUpdate);
    this.quill.on(I18N_MESSAGES_UPDATE, this.boundUpdate);

    this.update();
  }

  get value(): string {
    return this.currentValue;
  }

  update(): void {
    this.currentValue = this.i18n.t(this.key, this.params);

    // Update element if bound
    if (this.element) {
      this.element.textContent = this.currentValue;
    }
  }

  updateElement(element: HTMLElement | null): void {
    this.element = element || undefined;

    // Update immediately if element is provided
    if (this.element) {
      this.element.textContent = this.currentValue;
    }
  }

  setParams(params: Record<string, any>): void {
    this.params = params;
    this.update();
  }

  destroy(): void {
    this.quill.off(I18N_LOCALE_CHANGE, this.boundUpdate);
    this.quill.off(I18N_MESSAGES_UPDATE, this.boundUpdate);
    this.element = undefined;
  }
}

/**
 * Create a reactive translation element
 * @param quill Quill instance
 * @param tagName HTML tag name
 * @param key Translation key
 * @param params Optional parameters for interpolation
 */
export function createReactiveElement(
  quill: Quill,
  tagName: string,
  key: string,
  params?: Record<string, any>,
): { element: HTMLElement; reactive: ReactiveTranslation } {
  const element = document.createElement(tagName);
  const reactive = new ReactiveTranslation(quill, key, params);
  reactive.updateElement(element);
  return { element, reactive };
}
