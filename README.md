# Quill I18n Plugin

A comprehensive internationalization (i18n) module for Quill 2.x, providing translation management, language switching, and automatic UI updates.

## Features

- ✅ **Core i18n Module** - Translation management and language switching
- ✅ **Nested Translation Structure** - Support for hierarchical message organization
- ✅ **Parameterized Translations** - Dynamic values in translations
- ✅ **Event System** - Automatic UI updates on language change
- ✅ **Reactive Helpers** - Automatic DOM updates for custom UI
- ✅ **Toolbar i18n Support** - Optional internationalization for Quill's native toolbar
  - Prompt internationalization (link, image, video)
  - Picker internationalization (header, size, font, align)
- ✅ **TypeScript Support** - Full type definitions
- ✅ **Lightweight** - No dependencies except Quill

## Installation

```sh
npm install quill-i18n
```

## Quick Start

### Basic Usage (Core I18n Only)

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

### With Toolbar Prompt I18n

```ts
import Quill from 'quill';
import I18n, { createI18nToolbarHandlers } from 'quill-i18n';

Quill.register('modules/i18n', I18n);

const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'zh',
      messages: {
        zh: {
          toolbar: {
            link: { prompt: '请输入链接地址:' },
            image: { prompt: '请输入图片地址:' },
            video: { prompt: '请输入视频地址:' }
          }
        }
      }
    },
    toolbar: {
      container: [['bold', 'italic', 'link', 'image', 'video']],
      handlers: createI18nToolbarHandlers() // Enable i18n prompts
    }
  }
});
```

### With Full Toolbar I18n (Prompts + Pickers)

```ts
import Quill from 'quill';
import I18n, {
  createI18nToolbarHandlers,
  enableToolbarI18nAutoUpdate
} from 'quill-i18n';

Quill.register('modules/i18n', I18n);

const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'zh',
      messages: {
        en: {
          toolbar: {
            link: { prompt: 'Enter link URL:' },
            header: {
              normal: 'Normal',
              h1: 'Heading 1',
              h2: 'Heading 2'
            },
            size: {
              small: 'Small',
              normal: 'Normal',
              large: 'Large'
            }
          }
        },
        zh: {
          toolbar: {
            link: { prompt: '请输入链接地址:' },
            header: {
              normal: '正文',
              h1: '标题 1',
              h2: '标题 2'
            },
            size: {
              small: '小',
              normal: '正常',
              large: '大'
            }
          }
        }
      }
    },
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        [{ size: ['small', false, 'large'] }],
        ['bold', 'link', 'image']
      ],
      handlers: createI18nToolbarHandlers()
    }
  }
});

// Enable automatic picker i18n updates
enableToolbarI18nAutoUpdate(quill);

// Language switching will automatically update all toolbar UI
const i18n = quill.getModule('i18n');
i18n.setLocale('en'); // All prompts and pickers update to English
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
  locale?: string; // Current locale (default: 'en')
  fallbackLocale?: string; // Fallback locale (default: 'en')
  messages?: I18nMessages; // Translation messages
}
```

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

#### `createReactiveElement()`

Create DOM elements that automatically update when translations change.

```ts
import { createReactiveElement } from 'quill-i18n';

const button = createReactiveElement(
  quill,
  'button',
  'mymodule.button.save',
  { className: 'save-btn' }
);

document.body.appendChild(button);
// Button text will automatically update when locale changes
```

#### `ReactiveTranslation` Class

```ts
import { ReactiveTranslation } from 'quill-i18n';

const reactive = new ReactiveTranslation(quill, 'mymodule.title');

// Get current translation
console.log(reactive.value);

// Update element
const element = document.querySelector('.title');
reactive.updateElement(element);

// Cleanup
reactive.destroy();
```

## Advanced Usage

### Nested Translations

```ts
const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'en',
      messages: {
        en: {
          editor: {
            toolbar: {
              formatting: {
                bold: 'Bold',
                italic: 'Italic'
              }
            }
          }
        }
      }
    }
  }
});

const i18n = quill.getModule('i18n');
i18n.t('editor.toolbar.formatting.bold'); // "Bold"
```

### Parameterized Translations

```ts
const quill = new Quill('#editor', {
  modules: {
    i18n: {
      locale: 'en',
      messages: {
        en: {
          greeting: 'Hello, {name}!',
          items: 'You have {count} items'
        }
      }
    }
  }
});

const i18n = quill.getModule('i18n');
i18n.t('greeting', { name: 'John' }); // "Hello, John!"
i18n.t('items', { count: 5 }); // "You have 5 items"
```

### Custom Modules Integration

See [Third-Party Integration Guide](./docs/third-party-integration.md) for detailed instructions on integrating i18n into custom Quill modules.

## Complete Translation Example

```ts
const messages = {
  en: {
    toolbar: {
      // Prompts
      link: { prompt: 'Enter link URL:' },
      image: { prompt: 'Enter image URL:' },
      video: { prompt: 'Enter video URL:' },

      // Pickers
      header: {
        normal: 'Normal',
        h1: 'Heading 1',
        h2: 'Heading 2',
        h3: 'Heading 3'
      },
      size: {
        small: 'Small',
        normal: 'Normal',
        large: 'Large',
        huge: 'Huge'
      },
      font: {
        sans: 'Sans Serif',
        serif: 'Serif',
        monospace: 'Monospace'
      },
      align: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
        justify: 'Justify'
      }
    }
  },
  zh: {
    toolbar: {
      // Prompts
      link: { prompt: '请输入链接地址:' },
      image: { prompt: '请输入图片地址:' },
      video: { prompt: '请输入视频地址:' },

      // Pickers
      header: {
        normal: '正文',
        h1: '标题 1',
        h2: '标题 2',
        h3: '标题 3'
      },
      size: {
        small: '小',
        normal: '正常',
        large: '大',
        huge: '超大'
      },
      font: {
        sans: '无衬线',
        serif: '衬线',
        monospace: '等宽'
      },
      align: {
        left: '左对齐',
        center: '居中',
        right: '右对齐',
        justify: '两端对齐'
      }
    }
  }
};
```

## TypeScript Support

Full TypeScript definitions are included:

```ts
import type { I18nMessages, I18nOptions } from 'quill-i18n';

const options: I18nOptions = {
  locale: 'zh',
  messages: {
    zh: {
      mymodule: {
        title: '标题'
      }
    }
  }
};
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Quill 2.0+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
