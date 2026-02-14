import { describe, expect, it } from 'vitest';
import { createEditor } from './utils';

describe('Module', () => {
  it('should add a container with class bg-green-400', () => {
    const quill = createEditor();
    const moduleContainer = quill.container.querySelector('.module-container');
    expect(moduleContainer).not.toBeNull();
    expect(moduleContainer?.classList.contains('bg-green-400')).toBe(true);
  });

  it('module container should be inside the quill root', () => {
    const quill = createEditor();
    expect(quill.container).toEqualHTML(
      `
        <div class="ql-editor ql-blank" contenteditable="true">
          <p><br></p>
        </div>
        <div class="ql-tooltip ql-hidden">
          <a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>
          <input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">
          <a class="ql-action"></a>
          <a class="ql-remove"></a>
        </div>
        <div class="module-container bg-green-400"></div>
      `,
    );
  });
});
