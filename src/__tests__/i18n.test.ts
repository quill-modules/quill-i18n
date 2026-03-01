import { describe, expect, it, vi } from 'vitest';
import I18n from '../i18n';
import { createEditor } from './utils';

describe('constructor and initialization', () => {
  it('should initialize with default values', () => {
    const quill = createEditor();
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n).toBeInstanceOf(I18n);
    expect(i18n.getLocale()).toBe('en-US');
    expect(i18n.getAvailableLocales()).toEqual([]);
  });

  it('should initialize with custom locale', () => {
    const quill = createEditor({
      locale: 'zh-CN',
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.getLocale()).toBe('zh-CN');
  });

  it('should initialize with custom fallback locale', () => {
    const quill = createEditor({
      fallbackLocale: 'en-US',
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.options.fallbackLocale).toBe('en-US');
  });

  it('should initialize with messages', () => {
    const messages = {
      'en-US': { hello: 'Hello', greeting: 'Hello, {name}!' },
      'zh-CN': { hello: '你好', greeting: '你好，{name}！' },
    };
    const quill = createEditor({ messages });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.options.messages).toEqual(messages);
    expect(i18n.getAvailableLocales()).toEqual(['en-US', 'zh-CN']);
  });
});

describe('t() - translation method', () => {
  it('should return translation for simple key', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { greeting: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('greeting')).toBe('Hello');
  });

  it('should return translation for nested key', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          toolbar: {
            link: { prompt: 'Enter link URL:' },
          },
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('toolbar.link.prompt')).toBe('Enter link URL:');
  });

  it('should fallback to fallbackLocale when translation not found', () => {
    const quill = createEditor({
      locale: 'zh-CN',
      fallbackLocale: 'en-US',
      messages: {
        'en-US': { greeting: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('greeting')).toBe('Hello');
  });

  it('should return default value when translation not found', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {},
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('missing.key', {}, 'Default Text')).toBe('Default Text');
  });

  it('should return key when translation not found and no default', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {},
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('missing.key')).toBe('missing.key');
  });

  it('should return empty string for invalid key', () => {
    const quill = createEditor({ locale: 'en-US' });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('')).toBe('');
    expect(i18n.t(undefined as any)).toBe('');
    expect(i18n.t(null as any)).toBe('');
    expect(i18n.t(123 as any)).toBe('');
  });

  it('should interpolate parameters', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          greeting: 'Hello, {name}!',
          items: 'You have {count} items',
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('greeting', { name: 'John' })).toBe('Hello, John!');
    expect(i18n.t('items', { count: 5 })).toBe('You have 5 items');
  });

  it('should handle multiple parameters', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          message: 'Hello {name}, you have {count} new messages',
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('message', { name: 'Alice', count: 3 })).toBe('Hello Alice, you have 3 new messages');
  });

  it('should handle object with empty key as fallback', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          format: {
            'bold': 'Bold',
            '': 'Normal',
          },
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('format.bold')).toBe('Bold');
    expect(i18n.t('format.')).toBe('Normal');
  });

  it('should handle deeply nested paths', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          editor: {
            toolbar: {
              formatting: {
                bold: 'Bold',
                italic: 'Italic',
              },
            },
          },
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('editor.toolbar.formatting.bold')).toBe('Bold');
    expect(i18n.t('editor.toolbar.formatting.italic')).toBe('Italic');
  });

  it('should handle invalid interpolation parameters', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          greeting: 'Hello, {name}!',
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    // Missing parameters - empty object or unrelated key
    expect(i18n.t('greeting', {})).toBe('Hello, {name}!');
    expect(i18n.t('greeting', { other: 'value' })).toBe('Hello, {name}!');
    // Null/undefined parameter values
    expect(i18n.t('greeting', { name: undefined })).toBe('Hello, {name}!');
    expect(i18n.t('greeting', { name: null })).toBe('Hello, {name}!');
  });

  it('should handle numeric parameter values', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          count: 'Count: {num}',
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('count', { num: 42 })).toBe('Count: 42');
  });
});

describe('setLocale() - locale switching', () => {
  it('should change current locale', () => {
    const quill = createEditor({ locale: 'en-US' });
    const i18n = quill.getModule('i18n') as I18n;

    i18n.setLocale('zh-CN');

    expect(i18n.getLocale()).toBe('zh-CN');
  });

  it('should emit locale-change event', () => {
    const quill = createEditor({ locale: 'en-US' });
    const i18n = quill.getModule('i18n') as I18n;

    const handler = vi.fn();
    quill.on('i18n-locale-change', handler);

    i18n.setLocale('zh-CN');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: 'zh-CN',
        oldLocale: 'en-US',
      }),
    );
  });

  it('should update translation after locale change', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { hello: 'Hello' },
        'zh-CN': { hello: '你好' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('hello')).toBe('Hello');

    i18n.setLocale('zh-CN');

    expect(i18n.t('hello')).toBe('你好');
  });

  it('should handle switching to same locale', () => {
    const quill = createEditor({ locale: 'en-US' });
    const i18n = quill.getModule('i18n') as I18n;

    const handler = vi.fn();
    quill.on('i18n-locale-change', handler);

    i18n.setLocale('en-US');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: 'en-US',
        oldLocale: 'en-US',
      }),
    );
  });
});

describe('getLocale() - get current locale', () => {
  it('should return current locale', () => {
    const quill = createEditor({ locale: 'fr-FR' });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.getLocale()).toBe('fr-FR');
  });
});

describe('addMessages() - add translation messages', () => {
  it('should add messages for existing locale', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { hello: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    i18n.addMessages('en-US', { goodbye: 'Goodbye' });

    expect(i18n.t('hello')).toBe('Hello');
    expect(i18n.t('goodbye')).toBe('Goodbye');
  });

  it('should add messages for new locale', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { hello: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    i18n.addMessages('zh-CN', { hello: '你好' });

    expect(i18n.getAvailableLocales()).toContain('zh-CN');
    i18n.setLocale('zh-CN');

    expect(i18n.t('hello')).toBe('你好');
  });

  it('should emit messages-update event', () => {
    const quill = createEditor();
    const i18n = quill.getModule('i18n') as I18n;

    const handler = vi.fn();
    quill.on('i18n-messages-update', handler);

    i18n.addMessages('en-US', { key: 'value' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: 'en-US',
      }),
    );
  });
});

describe('setMessages() - set all messages', () => {
  it('should replace all messages', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { hello: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    i18n.setMessages({
      'en-US': { goodbye: 'Goodbye' },
      'zh-CN': { hello: '你好' },
    });

    expect(i18n.t('goodbye')).toBe('Goodbye');
    expect(i18n.t('hello')).toBe('hello');
    expect(i18n.getAvailableLocales()).toEqual(['en-US', 'zh-CN']);
  });
});

describe('has() - check if translation exists', () => {
  it('should return true for existing key in current locale', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { hello: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.has('hello')).toBe(true);
  });

  it('should return false for missing key', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { hello: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.has('goodbye')).toBe(false);
  });

  it('should check specific locale when provided', () => {
    const quill = createEditor({
      locale: 'zh-CN',
      messages: {
        'zh-CN': { hello: '你好' },
        'en-US': { hello: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.has('hello', 'zh-CN')).toBe(true);
    expect(i18n.has('hello', 'en-US')).toBe(true);
    expect(i18n.has('goodbye', 'zh-CN')).toBe(false);
    expect(i18n.has('goodbye', 'en-US')).toBe(false);
  });

  it('should return true for nested keys', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': {
          toolbar: {
            link: { prompt: 'Enter URL:' },
          },
        },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.has('toolbar.link.prompt')).toBe(true);
    expect(i18n.has('toolbar.link.missing')).toBe(false);
  });
});

describe('getAvailableLocales() - get available locales', () => {
  it('should return array of available locale codes', () => {
    const quill = createEditor({
      messages: {
        'en-US': { hello: 'Hello' },
        'zh-CN': { hello: '你好' },
        'fr-FR': { hello: 'Bonjour' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    const locales = i18n.getAvailableLocales();
    expect(locales).toHaveLength(3);
    expect(locales).toContain('en-US');
    expect(locales).toContain('zh-CN');
    expect(locales).toContain('fr-FR');
  });

  it('should return empty array when no messages', () => {
    const quill = createEditor();
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.getAvailableLocales()).toEqual([]);
  });

  it('should update when new locale is added', () => {
    const quill = createEditor({
      messages: {
        'en-US': { hello: 'Hello' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.getAvailableLocales()).toEqual(['en-US']);

    i18n.addMessages('zh-CN', { hello: '你好' });

    expect(i18n.getAvailableLocales()).toEqual(['en-US', 'zh-CN']);
  });
});

describe('options.getValue - custom value lookup', () => {
  it('should use custom getValue function when provided', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        // flat key structure: obj passed to getValue is messages[locale]
        'en-US': { 'toolbar.link.prompt': 'Enter link URL:' },
      },
      getValue: (obj, path) => obj?.[path] as string | undefined,
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('toolbar.link.prompt')).toBe('Enter link URL:');
  });

  it('should bypass built-in dot-path lookup when custom getValue is provided', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { toolbar: { link: { prompt: 'Enter link URL:' } } },
      },
      // always return undefined — built-in nested lookup never runs
      getValue: (_obj, _path) => undefined,
    });
    const i18n = quill.getModule('i18n') as I18n;

    // should fall back to key since getValue returns undefined
    expect(i18n.t('toolbar.link.prompt')).toBe('toolbar.link.prompt');
  });

  it('should fall back to fallbackLocale when getValue returns undefined for current locale', () => {
    const quill = createEditor({
      locale: 'zh-CN',
      fallbackLocale: 'en-US',
      messages: {
        'en-US': { hello: 'Hello' },
        'zh-CN': {},
      },
      getValue: (obj, path) => obj?.[path] as string | undefined,
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('hello')).toBe('Hello');
  });

  it('should call getValue with correct obj and path', () => {
    const messages = { 'en-US': { greeting: 'Hello' } };
    const getValue = vi.fn((_obj: any, _path: string) => 'mocked');
    const quill = createEditor({ locale: 'en-US', messages, getValue });
    const i18n = quill.getModule('i18n') as I18n;

    i18n.t('greeting');

    expect(getValue).toHaveBeenCalledTimes(1);
    expect(getValue).toHaveBeenCalledWith(messages['en-US'], 'greeting');
  });

  it('should fall back to built-in lookup when getValue is not provided', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { toolbar: { link: { prompt: 'Enter link URL:' } } },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('toolbar.link.prompt')).toBe('Enter link URL:');
  });
});

describe('options.interpolate - custom interpolation', () => {
  it('should use custom interpolate function when provided', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { greeting: 'Hello, {{name}}!' },
      },
      interpolate: (template, params) => {
        return template.replaceAll(/\{\{(\w+)\}\}/g, (match, key) => {
          return params[key] != null ? String(params[key]) : match;
        });
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('greeting', { name: 'John' })).toBe('Hello, John!');
  });

  it('should bypass built-in {paramName} syntax when custom interpolate is provided', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { greeting: 'Hello, {name}!' },
      },
      interpolate: (template, _params) => template,
    });
    const i18n = quill.getModule('i18n') as I18n;

    // custom function returns template as-is, so {name} should NOT be replaced
    expect(i18n.t('greeting', { name: 'John' })).toBe('Hello, {name}!');
  });

  it('should fall back to built-in interpolation when interpolate option is not provided', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { greeting: 'Hello, {name}!' },
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('greeting', { name: 'John' })).toBe('Hello, John!');
  });

  it('should call custom interpolate with correct template and params', () => {
    const interpolate = vi.fn((template: string, params: Record<string, any>) => {
      return template.replace('{name}', params.name);
    });
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { greeting: 'Hello, {name}!' },
      },
      interpolate,
    });
    const i18n = quill.getModule('i18n') as I18n;

    i18n.t('greeting', { name: 'Alice' });

    expect(interpolate).toHaveBeenCalledTimes(1);
    expect(interpolate).toHaveBeenCalledWith('Hello, {name}!', { name: 'Alice' });
  });

  it('should support multiple params in custom interpolate', () => {
    const quill = createEditor({
      locale: 'en-US',
      messages: {
        'en-US': { message: 'Hi %{name}, you have %{count} messages.' },
      },
      interpolate: (template, params) => {
        return template.replaceAll(/%\{(\w+)\}/g, (match, key) => {
          return params[key] != null ? String(params[key]) : match;
        });
      },
    });
    const i18n = quill.getModule('i18n') as I18n;

    expect(i18n.t('message', { name: 'Bob', count: 3 })).toBe('Hi Bob, you have 3 messages.');
  });
});
