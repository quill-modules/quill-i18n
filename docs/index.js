const Quill = window.Quill;
const QuillI18n = window.QuillI18n;
const { QuillToolbarTip, createI18nToolbarTipMap } = window.QuillToolbarTip;
// Translation messages
const messages = {
  'en-US': {
    toolbar: {
      'header': {
        '': 'Normal',
        '1': 'Heading 1',
        '2': 'Heading 2',
        '3': 'Heading 3',
        '4': 'Heading 4',
        '5': 'Heading 5',
        '6': 'Heading 6',
      },
      'size': {
        'small': 'Small',
        '': 'Normal',
        'large': 'Large',
        'huge': 'Huge',
      },
      'font': {
        '': 'Sans Serif',
        'sans': 'Sans Serif',
        'serif': 'Serif',
        'monospace': 'Monospace',
      },
      'script': {
        sub: 'Subscript',
        super: 'Superscript',
      },
      'align': {
        '': 'Align Left',
        'center': 'Align Center',
        'right': 'Align Right',
        'justify': 'Justify',
      },
      'indent': {
        '-1': 'Decrease Indent',
        '+1': 'Increase Indent',
      },
      'direction': {
        '': 'Switch to LTR',
        'rtl': 'Switch to RTL',
      },
      'list': {
        ordered: 'Numbered List',
        bullet: 'Bulleted List',
        check: 'Checklist',
      },
      'bold': 'Bold Text',
      'italic': 'Italic Text',
      'underline': 'Underline Text',
      'strike': 'Strikethrough',
      'blockquote': 'Block Quote',
      'code-block': 'Code Block',
      'code': 'Inline Code',
      'clean': 'Clear Formatting',
      'link': {
        '': 'Insert Link',
        'prompt': 'Enter link URL:',
      },
      'image': {
        '': 'Insert Image',
        'prompt': 'Enter image URL:',
      },
      'video': {
        '': 'Insert Video',
        'prompt': 'Enter video URL:',
      },
      'formula': 'Insert Formula',
      'color': 'Color',
      'background': 'Background Color',
    },
    demo: {
      title: 'Welcome to Quill i18n Plugin',
      description: 'Version {{version}} — a demonstration of automatic translation updates',
    },
  },
  'zh-CN': {
    toolbar: {
      'header': {
        '': '正文',
        '1': '标题 1',
        '2': '标题 2',
        '3': '标题 3',
        '4': '标题 4',
        '5': '标题 5',
        '6': '标题 6',
      },
      'size': {
        'small': '小',
        '': '正常',
        'large': '大',
        'huge': '超大',
      },
      'font': {
        '': '无衬线',
        'sans': '无衬线',
        'serif': '衬线',
        'monospace': '等宽',
      },
      'script': {
        sub: '下标',
        super: '上标',
      },
      'align': {
        '': '左对齐',
        'center': '居中对齐',
        'right': '右对齐',
        'justify': '两端对齐',
      },
      'indent': {
        '+1': '增加缩进',
        '-1': '减少缩进',
      },
      'direction': {
        '': '从左向右排列',
        'rtl': '从右向左排列',
      },
      'list': {
        ordered: '有序列表',
        bullet: '无序列表',
        check: '代办列表',
      },
      'bold': '加粗',
      'italic': '斜体',
      'underline': '下划线',
      'strike': '删除线',
      'blockquote': '引用',
      'code-block': '代码块',
      'code': '行内代码',
      'clean': '清除格式',
      'link': {
        '': '链接',
        'prompt': '请输入链接地址：',
      },
      'image': {
        '': '图片',
        'prompt': '请输入图片地址：',
      },
      'video': {
        '': '视频',
        'prompt': '请输入视频地址：',
      },
      'formula': '公式',
      'color': '文本颜色',
      'background': '背景颜色',
    },
    demo: {
      title: '欢迎使用 Quill i18n 插件',
      description: '版本 {{version}} — 这是一个自动翻译更新的演示',
    },
  },
};

// Register i18n module
Quill.register({
  'modules/i18n': QuillI18n.I18n,
  [`modules/${QuillToolbarTip.moduelName}`]: QuillToolbarTip,
}, true);

// Initialize Quill with i18n
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    i18n: {
      locale: 'en-US',
      messages,
      interpolate(template, params) {
        return template.replaceAll(/\{\{(\w+)\}\}/g, (match, key) => {
          return params[key] != null ? String(params[key]) : match;
        });
      },
      getValue(obj, path) {
        return this.getNestedValue(obj, path);
      },
    },
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ color: [] }, { background: [] }],
        ['blockquote', 'code-block', 'code', 'clean'],
        ['link', 'image', 'video', 'formula'],
        ['direction', { direction: 'rtl' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ font: [] }],
        [{ align: [] }, { align: '' }, { align: 'right' }, { align: 'center' }, { align: 'justify' }],
        [{ indent: '-1' }, { indent: '+1' }],
      ],
      handlers: QuillI18n.createI18nToolbarHandlers(),
    },
    [QuillToolbarTip.moduelName]: {
      tipTextMap: createI18nToolbarTipMap(),
    },
  },
});

// Enable automatic toolbar picker i18n updates
QuillI18n.enableToolbarI18nAutoUpdate(quill);

const i18n = quill.getModule('i18n');

// Setup reactive translations
const titleElement = document.getElementById('reactive-title');
const descElement = document.getElementById('reactive-description');

const titleReactive = new QuillI18n.ReactiveTranslation(quill, 'demo.title');
const descReactive = new QuillI18n.ReactiveTranslation(quill, 'demo.description', { version: '0.1.0' });

titleReactive.updateElement(titleElement);
descReactive.updateElement(descElement);

// Language selector
const localeSelect = document.getElementById('locale-select');
localeSelect.addEventListener('change', (e) => {
  i18n.setLocale(e.target.value);
  console.log('Language changed to:', e.target.value);
});

// Listen to i18n events
quill.on('i18n-locale-change', (event) => {
  console.log('Locale changed:', event);
});

quill.on('i18n-messages-update', (event) => {
  console.log('Messages updated:', event);
});

// Add some initial content
quill.setContents([
  { insert: 'Welcome to Quill i18n Plugin\n', attributes: { header: 1 } },
  { insert: '\nThis is a complete example demonstrating the following features:\n\n' },
  { insert: '1. Toolbar prompt internationalization\n' },
  { insert: '2. Picker dropdown internationalization\n' },
  { insert: '3. Language switching\n' },
  { insert: '4. Reactive translation updates\n' },
  { insert: '\nTry switching the language and observe the UI changes!\n' },
]);

console.log('Quill i18n plugin loaded successfully!');
