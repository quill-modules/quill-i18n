# Quill I18n Plugin

A comprehensive i18n module for Quill 2.x, providing translation management, language switching, and automatic UI updates.

## Features

- ✅ **Core i18n Module** - Translation management and language switching
- ✅ **Parameterized Translations** - Dynamic values in translations
- ✅ **Event System** - Automatic UI updates on language change
- ✅ **Reactive Helpers** - Automatic DOM updates for custom UI
- ✅ **Toolbar i18n Support** - Optional internationalization for Quill's native toolbar
  - Prompt internationalization (link, image, video)
  - Picker internationalization (header, size, font, align)

## Installation

```sh
npm install quill-i18n
```

## Quick Start

### Basic Usage

[demo code](https://github.com/quill-modules/quill-i18n/blob/main/docs/index.js)

```ts
import Quill from 'quill';
import I18n from 'quill-i18n';

Quill.register('modules/i18n', I18n);

const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'zh',
      messages: {
        en: {
          mymodule: {
            title: 'My Module',
            description: 'This is my custom module'
          }
        },
        zh: {
          mymodule: {
            title: '我的模块',
            description: '这是我的自定义模块'
          }
        }
      }
    }
  }
});

// Use in your custom modules
const i18n = quill.getModule('i18n');
console.log(i18n.t('mymodule.title')); // "我的模块"

// Switch language
i18n.setLocale('en');
console.log(i18n.t('mymodule.title')); // "My Module"
```

### With Default Toolbar Picker and `link/image/video` Tip Update

```ts
import Quill from 'quill';
import I18n, { createI18nToolbarHandlers, enableToolbarI18nAutoUpdate } from 'quill-i18n';

Quill.register('modules/i18n', I18n);

const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'en-US',
      messages: {
        'en-US': {
          toolbar: {
            header: {
              '': 'Normal',
              '1': 'Heading 1',
              '2': 'Heading 2',
              '3': 'Heading 3',
            },
            bold: 'Bold Text',
            italic: 'Italic Text',
            link: {
              '': 'Insert Link',
              'prompt': 'Enter link URL:',
            },
            image: {
              '': 'Insert Image',
              'prompt': 'Enter image URL:',
            },
            video: {
              '': 'Insert Video',
              'prompt': 'Enter video URL:',
            },
          }
        }
      }
    },
    toolbar: {
      container: [[{ header: [] }, 'bold', 'italic', 'link', 'image', 'video']],
      handlers: createI18nToolbarHandlers() // Enable link/image/video i18n prompts
    }
  }
});

// Enable automatic toolbar picker i18n updates
enableToolbarI18nAutoUpdate(quill);
```

## API Reference

### Core I18n Module

#### `I18n` Class

```ts
class I18n {
  constructor(quill: Quill, options: I18nOptions);

  // Get translated text
  t(key: string, params?: Record<string, any>, defaultValue?: string): string;

  // Change current locale
  setLocale(locale: string): void;

  // Add or update messages for a locale
  addMessages(locale: string, messages: I18nMessages): void;

  // Get current locale
  getLocale(): string;
}
```

#### Options

```ts
interface I18nOptions {
  locale?: string; // Current locale (default: 'en-US')
  fallbackLocale?: string; // Fallback locale (default: 'en-US')
  messages?: I18nMessages; // Translation messages
  interpolate?: (this: QuillI18n, template: string, params: Record<string, any>) => string; // Custom interpolation function
  getValue?: (this: QuillI18n, obj: Record<string, any> | undefined, path: string) => string | undefined; // Custom value lookup function
}
```

##### `interpolate` Option

By default, translations use `{paramName}` syntax for parameter interpolation. You can replace this behavior entirely by providing a custom `interpolate` function:

```ts
const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'en-US',
      messages: {
        'en-US': { greeting: 'Hello, {{name}}!' }
      },
      // Replace built-in {name} syntax with {{name}} (mustache-style)
      interpolate: (template, params) => {
        return template.replaceAll(/\{\{(\w+)\}\}/g, (match, key) => {
          return params[key] != null ? String(params[key]) : match;
        });
      }
    }
  }
});

const i18n = quill.getModule('i18n');
i18n.t('greeting', { name: 'John' }); // "Hello, John!"
```

When `interpolate` is not provided, the built-in `{paramName}` syntax is used.

##### `getValue` Option

By default, translation keys use dot-notation to access nested message objects (e.g. `'toolbar.link.prompt'`). You can replace this lookup entirely by providing a custom `getValue` function — useful when using flat keys, external data sources, or custom message formats:

```ts
const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'en-US',
      messages: {
        // flat key structure instead of nested objects
        'en-US': { 'toolbar.link.prompt': 'Enter link URL:' }
      },
      // obj is messages[locale], path is the translation key
      getValue: (obj, path) => obj?.[path] as string | undefined
    }
  }
});

const i18n = quill.getModule('i18n');
i18n.t('toolbar.link.prompt'); // "Enter link URL:"
```

Returning `undefined` from `getValue` triggers the fallback locale, consistent with built-in behavior. When `getValue` is not provided, the built-in dot-path nested lookup is used.

#### Events

```ts
// Emitted when locale changes
quill.on('i18n-locale-change', (event: { locale: string; prevLocale: string }) => {
  console.log(`Language changed from ${event.prevLocale} to ${event.locale}`);
});

// Emitted when messages are updated
quill.on('i18n-messages-update', (event: { locale: string }) => {
  console.log(`Messages updated for ${event.locale}`);
});
```

### Toolbar Helpers

#### `createI18nToolbarHandlers()`

Creates toolbar handlers with i18n support for prompts.

```ts
import { createI18nToolbarHandlers } from 'quill-i18n';

const quill = new Quill('#editor', {
  modules: {
    toolbar: {
      handlers: createI18nToolbarHandlers()
    }
  }
});
```

**Supported handlers:**

- `link` - Link URL prompt
- `image` - Image URL prompt
- `video` - Video URL prompt

**Translation keys:**

- `toolbar.link.prompt`
- `toolbar.image.prompt`
- `toolbar.video.prompt`

#### `updateToolbarI18n(quill)`

Manually update toolbar picker labels (one-time update).

```ts
import { updateToolbarI18n } from 'quill-i18n';

const quill = new Quill('#editor', { /* ... */ });
updateToolbarI18n(quill);
```

#### `enableToolbarI18nAutoUpdate(quill)`

Enable automatic toolbar picker updates on language change.

```ts
import { enableToolbarI18nAutoUpdate } from 'quill-i18n';

const quill = new Quill('#editor', { /* ... */ });
enableToolbarI18nAutoUpdate(quill);

// Now pickers will auto-update when locale changes
const i18n = quill.getModule('i18n');
i18n.setLocale('en'); // Pickers automatically update
```

**Supported pickers:**

- `header` - Heading levels
- `size` - Font sizes
- `font` - Font families
- `align` - Text alignment

**Translation keys:**

```ts
/* eslint-disable ts/no-unused-expressions */

// Header
toolbar.header.normal;
toolbar.header.h1;
toolbar.header.h2;
toolbar.header.h3;
toolbar.header.h4;
toolbar.header.h5;
toolbar.header.h6;

// Size
toolbar.size.small;
toolbar.size.normal;
toolbar.size.large;
toolbar.size.huge;

// Font
toolbar.font.sans;
toolbar.font.serif;
toolbar.font.monospace;

// Align
toolbar.align.left;
toolbar.align.center;
toolbar.align.right;
toolbar.align.justify;
```

### Reactive Helpers

#### `i18n.createReactiveElement()`

Create DOM elements that automatically update when translations change.

```ts
// Method 1: Via i18n instance (recommended for custom modules)
const i18n = quill.getModule('i18n');
const { element, reactive } = i18n.createReactiveElement(
  'button',
  'mymodule.button.save',
);
element.classList.add('save-btn');
document.body.appendChild(element);
// Button text will automatically update when locale changes
```

```ts
// Method 2: Direct import (also available)
import { createReactiveElement } from 'quill-i18n';

const { element, reactive } = createReactiveElement(
  quill,
  'button',
  'mymodule.button.save'
);
```

#### `i18n.createReactive()`

Create a reactive translation instance.

```ts
// Method 1: Via i18n instance (recommended for custom modules)
const i18n = quill.getModule('i18n');
const reactive = i18n.createReactive('mymodule.title');

// Get current translation
console.log(reactive.value);

// Update element
const element = document.querySelector('.title');
reactive.updateElement(element);

// Cleanup
reactive.destroy();
```

```ts
// Method 2: Direct import (also available)
import { ReactiveTranslation } from 'quill-i18n';

const reactive = new ReactiveTranslation(quill, 'mymodule.title');
```

## Custom Modules Integration

Integrate i18n into your custom Quill modules with these patterns.

### Basic Usage

Get the i18n module instance and use the `t()` method:

```ts
import type Quill from 'quill';
import { Module } from 'quill';

class MyCustomModule extends Module {
  constructor(quill: Quill, options: any) {
    super(quill, options);
    const i18n = quill.getModule('i18n');

    // Get translated text
    const title = i18n.t('mymodule.title');
    console.log(title); // "My Module" or "我的模块"

    // With parameters
    const message = i18n.t('mymodule.welcome', { name: 'John' });
    console.log(message); // "Welcome, John!" or "欢迎, John!"
  }
}

Quill.register('modules/mymodule', MyCustomModule);
```

### Using Reactive Translation

For automatic UI updates without manual event handling:

```ts
class MyCustomModule extends Module {
  private titleTranslation: ReturnType<I18n['createReactive']>;
  private countTranslation: ReturnType<I18n['createReactive']>;

  constructor(quill: Quill, options: any) {
    super(quill, options);
    const i18n = quill.getModule('i18n');

    // Create reactive translations via i18n instance
    this.titleTranslation = i18n.createReactive('mymodule.title');
    this.countTranslation = i18n.createReactive('mymodule.count', { count: 0 });

    // Bind to elements
    const titleEl = document.querySelector('.mymodule-title');
    this.titleTranslation.updateElement(titleEl);

    const countEl = document.querySelector('.mymodule-count');
    this.countTranslation.updateElement(countEl);
  }

  updateCount(count: number) {
    // Update parameters - UI updates automatically
    this.countTranslation.setParams({ count });
  }

  destroy() {
    // Cleanup reactive translations
    this.titleTranslation.destroy();
    this.countTranslation.destroy();
  }
}
```

### Creating Reactive Elements

Create DOM elements that automatically update when translations change:

```ts
class MyCustomModule extends Module {
  constructor(quill: Quill, options: any) {
    super(quill, options);
    const i18n = quill.getModule('i18n');

    // Create a reactive button element
    const { element, reactive } = i18n.createReactiveElement(
      'button',
      'mymodule.actions.save',
    );
    element.classList.add('save-btn');
    this.container.appendChild(element);
    // Button text will automatically update when locale changes
  }
}
```

### Adding Messages Dynamically

You can add translations at runtime:

```ts
class MyCustomModule extends Module {
  constructor(quill: Quill, options: any) {
    super(quill, options);
    const i18n = quill.getModule('i18n');

    // Organize your translations with a module namespace
    // Add messages for your module
    i18n.addMessages('en-US', {
      mymodule: {
        title: 'My Module'
      }
    });

    i18n.addMessages('zh-CN', {
      mymodule: {
        title: '我的模块'
      }
    });
  }
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
