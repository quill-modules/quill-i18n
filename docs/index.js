const Quill = window.Quill;
const QuillI18n = window.QuillI18n;
const { QuillToolbarTip, createI18nToolbarTipMap } = window.QuillToolbarTip;
const {
  default: TableUp,
  TableAlign,
  TableVirtualScrollbar,
  TableResizeLine,
  TableMenuContextmenu,
  TableResizeScale,
  defaultCustomSelect,
  TableSelection,
} = window.TableUp;

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
      description: 'Version {{version}} - a demonstration of automatic translation updates',
    },
    tableUp: {
      fullCheckboxText: 'Insert full width table',
      customBtnText: 'Custom',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      rowText: 'Row',
      colText: 'Column',
      notPositiveNumberError: 'Please enter a positive integer',
      custom: 'Custom',
      clear: 'Clear',
      transparent: 'Transparent',
      perWidthInsufficient: 'The percentage width is insufficient. To complete the operation, the table needs to be converted to a fixed width. Do you want to continue?',
      CopyCell: 'Copy cell',
      CutCell: 'Cut cell',
      InsertTop: 'Insert row above',
      InsertRight: 'Insert column right',
      InsertBottom: 'Insert row below',
      InsertLeft: 'Insert column left',
      MergeCell: 'Merge Cell',
      SplitCell: 'Split Cell',
      DeleteRow: 'Delete Row',
      DeleteColumn: 'Delete Column',
      DeleteTable: 'Delete table',
      BackgroundColor: 'Set background color',
      BorderColor: 'Set border color',
      SwitchWidth: 'Switch table width',
      InsertCaption: 'Insert table caption',
      ToggleTdBetweenTh: 'Toggle td between th',
      ConvertTothead: 'Convert to thead',
      ConvertTotfoot: 'Convert to tfoot',
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
    tableUp: {
      fullCheckboxText: '插入满宽表格',
      customBtnText: '自定义行列数',
      confirmText: '确认',
      cancelText: '取消',
      rowText: '行数',
      colText: '列数',
      notPositiveNumberError: '请输入正整数',
      custom: '自定义',
      clear: '清除',
      transparent: '透明',
      perWidthInsufficient: '百分比宽度不足。若继续操作，需要转为固定宽度，是否继续？',
      CopyCell: '复制单元格',
      CutCell: '剪切单元格',
      InsertTop: '向上插入一行',
      InsertRight: '向右插入一列',
      InsertBottom: '向下插入一行',
      InsertLeft: '向左插入一列',
      MergeCell: '合并单元格',
      SplitCell: '拆分单元格',
      DeleteRow: '删除当前行',
      DeleteColumn: '删除当前列',
      DeleteTable: '删除当前表格',
      BackgroundColor: '设置背景颜色',
      BorderColor: '设置边框颜色',
      SwitchWidth: '切换表格宽度',
      InsertCaption: '插入表格标题',
      ToggleTdBetweenTh: '切换表头单元格',
      ConvertTothead: '转换为表头',
      ConvertTotfoot: '转换为表尾',
    },
  },
};

Quill.register({
  'modules/i18n': QuillI18n.I18n,
  [`modules/${QuillToolbarTip.moduelName}`]: QuillToolbarTip,
  [`modules/${TableUp.moduleName}`]: TableUp,
}, true);

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
        [{ [TableUp.toolName]: [] }],
      ],
      handlers: QuillI18n.createI18nToolbarHandlers(),
    },
    [QuillToolbarTip.moduelName]: {
      tipTextMap: createI18nToolbarTipMap(),
    },
    [TableUp.moduleName]: {
      customSelect: defaultCustomSelect,
      customBtn: true,
      fullSwitch: true,
      texts(key) {
        const i18nModule = this.quill.getModule('i18n');
        return i18nModule.t(`tableUp.${key}`);
      },
      modules: [
        { module: TableVirtualScrollbar },
        { module: TableAlign },
        { module: TableResizeLine },
        { module: TableResizeScale },
        { module: TableSelection },
        { module: TableMenuContextmenu },
      ],
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
localeSelect.addEventListener('change', async (e) => {
  i18n.setLocale(e.target.value);
  const tableUp = quill.getModule(TableUp.moduleName);
  await tableUp?.refreshUI();
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
