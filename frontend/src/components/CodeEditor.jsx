import React, { useRef } from 'react';
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
  theme: 'vs-dark',
};

export default function CodeEditor({ code, onChange, language }) {
  const monacoLang = getMonacoLanguage(language);

  const handleEditorMount = (editor, monaco) => {
    // Define custom dark theme matching our design
    monaco.editor.defineTheme('codereview-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '484f58', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: 'f2cc60' },
        { token: 'type', foreground: 'ffa657' },
        { token: 'function', foreground: 'd2a8ff' },
        { token: 'variable', foreground: 'e6edf3' },
      ],
      colors: {
        'editor.background': '#0f1318',
        'editor.foreground': '#e6edf3',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#8b949e',
        'editor.lineHighlightBackground': '#161b22',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#1c232c',
        'editorCursor.foreground': '#00d4ff',
        'editorWhitespace.foreground': '#21262d',
        'editorIndentGuide.background': '#21262d',
        'editorIndentGuide.activeBackground': '#30363d',
        'scrollbarSlider.background': '#30363d80',
        'scrollbarSlider.hoverBackground': '#484f5880',
      },
    });
    monaco.editor.setTheme('codereview-dark');
  };

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
