import type Quill from 'quill';
import type Toolbar from 'quill/modules/toolbar';
import type { I18n } from '../i18n';
import { I18N_LOCALE_CHANGE } from '../constants';

const PICKER_LABEL_MAPPINGS: Record<
  string,
  Record<string, { key: string; default: string }>
> = {
  header: {
    '': { key: 'toolbar.header.', default: 'Normal' },
    '1': { key: 'toolbar.header.1', default: 'Heading 1' },
    '2': { key: 'toolbar.header.2', default: 'Heading 2' },
    '3': { key: 'toolbar.header.3', default: 'Heading 3' },
    '4': { key: 'toolbar.header.4', default: 'Heading 4' },
    '5': { key: 'toolbar.header.5', default: 'Heading 5' },
    '6': { key: 'toolbar.header.6', default: 'Heading 6' },
  },
  size: {
    'small': { key: 'toolbar.size.small', default: 'Small' },
    '': { key: 'toolbar.size.', default: 'Normal' },
    'large': { key: 'toolbar.size.large', default: 'Large' },
    'huge': { key: 'toolbar.size.huge', default: 'Huge' },
  },
  font: {
    '': { key: 'toolbar.font.', default: 'Sans Serif' },
    'sans': { key: 'toolbar.font.sans', default: 'Sans Serif' },
    'serif': { key: 'toolbar.font.serif', default: 'Serif' },
    'monospace': { key: 'toolbar.font.monospace', default: 'Monospace' },
  },
  align: {
    '': { key: 'toolbar.align.left', default: 'Left' },
    'center': { key: 'toolbar.align.center', default: 'Center' },
    'right': { key: 'toolbar.align.right', default: 'Right' },
    'justify': { key: 'toolbar.align.justify', default: 'Justify' },
  },
};

function updatePickerLabels(
  picker: HTMLElement,
  pickerType: string,
  i18n: I18n,
) {
  const mapping = PICKER_LABEL_MAPPINGS[pickerType];
  if (!mapping) return;

  // Update picker label
  const label = picker.querySelector<HTMLElement>('.ql-picker-label');
  if (label) {
    const value = label.dataset.value || '';
    const config = mapping[value];
    if (config) {
      const translatedLabel = i18n.t(config.key, {}, config.default);
      label.dataset.label = translatedLabel;
    }
  }

  // Update picker items
  const items = Array.from(picker.querySelectorAll<HTMLElement>('.ql-picker-item'));
  for (const item of items) {
    const value = item.dataset.value || '';
    const config = mapping[value];
    if (config) {
      const translatedLabel = i18n.t(config.key, {}, config.default);
      item.dataset.label = translatedLabel;
    }
  }
}

function updatePicker(picker: HTMLElement, i18n: I18n) {
  let pickerType = '';

  if (picker.classList.contains('ql-header')) pickerType = 'header';
  else if (picker.classList.contains('ql-size')) pickerType = 'size';
  else if (picker.classList.contains('ql-font')) pickerType = 'font';
  else if (picker.classList.contains('ql-align')) pickerType = 'align';

  if (!pickerType) return;

  updatePickerLabels(picker, pickerType, i18n);
}

function updateAllPickers(container: HTMLElement, i18n: I18n) {
  const pickers = Array.from(container.querySelectorAll('.ql-picker'));
  for (const picker of pickers) {
    updatePicker(picker as HTMLElement, i18n);
  }
}

export function updateToolbarI18n(quill: Quill) {
  const i18n = quill.getModule('i18n') as I18n;
  if (!i18n) {
    console.warn('[quill-i18n] i18n module not found');
    return;
  }

  const toolbar = quill.getModule('toolbar') as any;
  if (!toolbar?.container) {
    console.warn('[quill-i18n] toolbar not found');
    return;
  }

  updateAllPickers(toolbar.container, i18n);
}

export function enableToolbarI18nAutoUpdate(quill: Quill) {
  const toolbar = quill.getModule('toolbar') as Toolbar;
  if (!toolbar) return;

  const toolbarContainer = toolbar.container;
  if (toolbarContainer?.querySelector('.ql-picker')) {
    updateToolbarI18n(quill);
  }
  else if (toolbarContainer) {
    const observer = new MutationObserver(() => {
      if (toolbarContainer.querySelector('.ql-picker')) {
        updateToolbarI18n(quill);
        observer.disconnect();
      }
    });
    observer.observe(toolbarContainer, { childList: true, subtree: true });
  }

  quill.on(I18N_LOCALE_CHANGE, () => {
    updateToolbarI18n(quill);
  });
}
