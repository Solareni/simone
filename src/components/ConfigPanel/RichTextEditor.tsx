import { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import MarkdownShortcuts from 'quill-markdown-shortcuts';

// 注册 Markdown 快捷键模块
Quill.register('modules/markdownShortcuts', MarkdownShortcuts);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);

  // 保持 onChange 引用最新
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (!editorElement || quillRef.current) return;

    // 初始化 Quill 实例(只初始化一次)
    const quill = new Quill(editorElement, {
      theme: 'snow',
      placeholder: placeholder || '描述职责和成就...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': [] }, { 'background': [] }],
          ['link'],
          ['clean']
        ],
        markdownShortcuts: {},
      },
      formats: [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list',
        'color', 'background',
        'link'
      ],
    });

    quillRef.current = quill;

    // 设置初始值
    if (value) {
      quill.root.innerHTML = value;
    }

    // 监听内容变化
    const handleTextChange = () => {
      const html = quill.root.innerHTML;
      onChangeRef.current(html);
    };
    quill.on('text-change', handleTextChange);

    // 清理函数
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change', handleTextChange);
        
        // 清理 toolbar
        const toolbarModule = quillRef.current.getModule('toolbar');
        if (toolbarModule && toolbarModule.container) {
          toolbarModule.container.remove();
        }

        // 清理 Quill 创建的 DOM 内容
        if (editorElement) {
          editorElement.innerHTML = '';
        }
        
        quillRef.current = null;
      }
    };
  }, [placeholder]);

  // 当外部 value 变化时更新编辑器内容
  useEffect(() => {
    if (!quillRef.current) return;
    const currentContent = quillRef.current.root.innerHTML;
    // 避免循环更新
    if (currentContent !== value) {
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div className="rich-text-editor">
      <div ref={editorRef} className="bg-white rounded-xl" />
      <style>{`
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          min-height: 200px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border: 1px solid #d1d5db;
        }
        .rich-text-editor .ql-container {
          border: 1px solid #d1d5db;
          border-top: none;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
          font-size: 14px;
          color: #111827;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}

