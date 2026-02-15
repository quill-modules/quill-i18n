/* eslint-disable no-alert */

import type Toolbar from 'quill/modules/toolbar';
import type I18n from '../i18n';

/**
 * Create i18n toolbar handlers for prompts
 * Handles link, image, and video prompts with i18n support
 */
export function createI18nToolbarHandlers() {
  return {
    link(this: Toolbar, value: boolean | string) {
      const i18n = this.quill.getModule('i18n') as I18n;

      if (value) {
        const range = this.quill.getSelection();
        if (!range || range.length === 0) return;

        let preview = this.quill.getText(range);
        if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
          preview = `mailto:${preview}`;
        }

        const promptText = i18n
          ? i18n.t('toolbar.link.prompt', {}, 'Enter link URL:')
          : 'Enter link URL:';
        console.log(promptText);
        const url = window.prompt(promptText, preview);

        if (url) {
          this.quill.formatText(range, 'link', url);
        }
      }
      else {
        this.quill.format('link', false);
      }
    },

    image(this: Toolbar) {
      const i18n = this.quill.getModule('i18n') as I18n;

      const promptText = i18n
        ? i18n.t('toolbar.image.prompt', {}, 'Enter image URL:')
        : 'Enter image URL:';

      const url = window.prompt(promptText);

      if (url) {
        const range = this.quill.getSelection(true);
        if (range) {
          this.quill.insertEmbed(range.index, 'image', url);
          this.quill.setSelection(range.index + 1);
        }
      }
    },

    video(this: Toolbar) {
      const i18n = this.quill.getModule('i18n') as I18n;

      const promptText = i18n
        ? i18n.t('toolbar.video.prompt', {}, 'Enter video URL:')
        : 'Enter video URL:';

      const url = window.prompt(promptText);

      if (url) {
        const range = this.quill.getSelection(true);
        if (range) {
          this.quill.insertEmbed(range.index, 'video', url);
          this.quill.setSelection(range.index + 1);
        }
      }
    },
  };
}
