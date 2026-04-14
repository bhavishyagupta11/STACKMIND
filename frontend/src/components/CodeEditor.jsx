import React, { memo, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { getMonacoLanguage } from '../utils/languages';

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  lineHeight: 22,
  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
  fontLigatures: true,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'gutter',
  lineNumbers: 'on',
  glyphMargin: false,
  folding: true,
  lineDecorationsWidth: 8,
  lineNumbersMinChars: 3,
  padding: { top: 16, bottom: 16 },
  overviewRulerBorder: false,
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
  },
  theme: 'stackmind-light',
};

function CodeEditor({ code, onChange, language, diagnostics = [] }) {
  const monacoLang = getMonacoLanguage(language);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('stackmind-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8b8175', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'cc7a00' },
        { token: 'string', foreground: '0f8a7b' },
        { token: 'number', foreground: 'b85c38' },
        { token: 'type', foreground: '1a8cff' },
        { token: 'function', foreground: '7a5af8' },
        { token: 'variable', foreground: '262626' },
      ],
      colors: {
        'editor.background': '#fcfbf8',
        'editor.foreground': '#262626',
        'editorLineNumber.foreground': '#b1a392',
        'editorLineNumber.activeForeground': '#7b6d5d',
        'editor.lineHighlightBackground': '#f5efe6',
        'editor.selectionBackground': '#ffe4b5',
        'editor.inactiveSelectionBackground': '#f1eadf',
        'editorCursor.foreground': '#ffa116',
        'editorWhitespace.foreground': '#e4ded4',
        'editorIndentGuide.background': '#ece4d9',
        'editorIndentGuide.activeBackground': '#d4c6b4',
        'scrollbarSlider.background': '#d4c6b480',
        'scrollbarSlider.hoverBackground': '#c4b29d80',
      },
    });
    monaco.editor.setTheme('stackmind-light');
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor?.getModel?.();

    if (!editor || !monaco || !model) return;

    const markerData = diagnostics.map((item) => ({
      severity: monaco.MarkerSeverity[item.severity === 'error' ? 'Error' : 'Warning'],
      startLineNumber: item.lineNumber || 1,
      startColumn: item.column || 1,
      endLineNumber: item.lineNumber || 1,
      endColumn: Math.max((item.column || 1) + 1, 2),
      message: item.message,
      source: item.source || 'STACKMIND',
    }));

    monaco.editor.setModelMarkers(model, 'stackmind-language', markerData);
  }, [diagnostics]);

  return (
    <div className="rounded-lg overflow-hidden border border-border" style={{ height: '420px' }}>
      <Editor
        height="100%"
        language={monacoLang}
        value={code}
        onChange={(val) => onChange(val || '')}
        options={EDITOR_OPTIONS}
        onMount={handleEditorMount}
        loading={
          <div className="h-full bg-bg-surface flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        }
      />
    </div>
  );
}

export default memo(CodeEditor);
