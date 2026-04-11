export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', ext: '.js', monaco: 'javascript' },
  { value: 'typescript', label: 'TypeScript', ext: '.ts', monaco: 'typescript' },
  { value: 'python', label: 'Python', ext: '.py', monaco: 'python' },
  { value: 'java', label: 'Java', ext: '.java', monaco: 'java' },
  { value: 'cpp', label: 'C++', ext: '.cpp', monaco: 'cpp' },
  { value: 'c', label: 'C', ext: '.c', monaco: 'c' },
  { value: 'csharp', label: 'C#', ext: '.cs', monaco: 'csharp' },
  { value: 'go', label: 'Go', ext: '.go', monaco: 'go' },
  { value: 'rust', label: 'Rust', ext: '.rs', monaco: 'rust' },
  { value: 'ruby', label: 'Ruby', ext: '.rb', monaco: 'ruby' },
  { value: 'php', label: 'PHP', ext: '.php', monaco: 'php' },
  { value: 'swift', label: 'Swift', ext: '.swift', monaco: 'swift' },
  { value: 'kotlin', label: 'Kotlin', ext: '.kt', monaco: 'kotlin' },
  { value: 'sql', label: 'SQL', ext: '.sql', monaco: 'sql' },
  { value: 'html', label: 'HTML', ext: '.html', monaco: 'html' },
  { value: 'css', label: 'CSS', ext: '.css', monaco: 'css' },
];

export const getMonacoLanguage = (value) =>
  LANGUAGES.find((l) => l.value === value)?.monaco || 'plaintext';

export const detectLanguageFromFilename = (filename) => {
  const ext = '.' + filename.split('.').pop().toLowerCase();
  return LANGUAGES.find((l) => l.ext === ext)?.value || 'javascript';
};

// Accepted file extensions for upload
export const ACCEPTED_EXTENSIONS = LANGUAGES.map((l) => l.ext).join(',');

const LANGUAGE_SIGNATURES = {
  javascript: [
    /(?:^|\n)\s*(?:const|let|var)\s+\w+\s*=/,
    /\bconsole\.log\s*\(/,
    /\bfunction\s+\w+\s*\(/,
    /=>/,
    /\bimport\s+.*\sfrom\s+['"]/,
  ],
  typescript: [
    /\binterface\s+\w+/,
    /\btype\s+\w+\s*=/,
    /:\s*(?:string|number|boolean|unknown|any|Record<|Array<|Promise<)/,
    /\b(?:enum|implements|readonly)\b/,
    /\bas\s+[A-Za-z_][\w<>[\]|]*/,
  ],
  python: [
    /(?:^|\n)\s*def\s+\w+\s*\(/,
    /(?:^|\n)\s*class\s+\w+\s*:/,
    /\bimport\s+\w+/,
    /\bprint\s*\(/,
    /:\s*(?:$|#)/,
  ],
  java: [
    /\bpublic\s+class\s+\w+/,
    /\bSystem\.out\.println\s*\(/,
    /\bimport\s+java\./,
    /\bpublic\s+static\s+void\s+main\s*\(/,
    /\bnew\s+\w+\s*\(/,
  ],
  cpp: [
    /(?:^|\n)\s*#include\s*<[^>]+>/,
    /\busing\s+namespace\s+std\s*;/,
    /\bstd::[A-Za-z_]\w*/,
    /\bcout\s*<</,
    /\bcin\s*>>/,
    /\bvector<[^>]+>/,
    /\bint\s+main\s*\(/,
  ],
  c: [
    /(?:^|\n)\s*#include\s*<[^>]+>/,
    /\bprintf\s*\(/,
    /\bscanf\s*\(/,
    /\bint\s+main\s*\(/,
    /\bstruct\s+\w+/,
  ],
  csharp: [
    /\busing\s+System\s*;/,
    /\bConsole\.WriteLine\s*\(/,
    /\bnamespace\s+\w+/,
    /\bpublic\s+class\s+\w+/,
    /\bstring\[\]\s+args\b/,
  ],
  go: [
    /(?:^|\n)\s*package\s+main\b/,
    /\bfunc\s+main\s*\(/,
    /\bfmt\.Print(?:ln|f)?\s*\(/,
    /\bimport\s*\(/,
    /\b:=\s*/,
  ],
  rust: [
    /\bfn\s+main\s*\(\)/,
    /\bprintln!\s*\(/,
    /\blet\s+mut\b/,
    /\buse\s+std::/,
    /\bimpl\s+\w+/,
  ],
  ruby: [
    /(?:^|\n)\s*def\s+\w+/,
    /\bputs\s+/,
    /(?:^|\n)\s*end\s*$/,
    /\brequire\s+['"]/,
    /\bclass\s+\w+/,
  ],
  php: [
    /<\?php/,
    /\becho\s+/,
    /\$\w+/,
    /\brequire(?:_once)?\s*\(/,
    /\bfunction\s+\w+\s*\(/,
  ],
  swift: [
    /\bimport\s+Foundation\b/,
    /\bprint\s*\(/,
    /\bfunc\s+\w+\s*\(/,
    /\bvar\s+\w+\s*:/,
    /\blet\s+\w+\s*:/,
  ],
  kotlin: [
    /\bfun\s+main\s*\(/,
    /\bprintln\s*\(/,
    /\bval\s+\w+\s*:/,
    /\bvar\s+\w+\s*:/,
    /\bdata\s+class\s+\w+/,
  ],
  sql: [
    /\bSELECT\b/i,
    /\bFROM\b/i,
    /\bWHERE\b/i,
    /\bINSERT\s+INTO\b/i,
    /\bCREATE\s+TABLE\b/i,
  ],
  html: [
    /<!doctype\s+html>/i,
    /<html[\s>]/i,
    /<body[\s>]/i,
    /<div[\s>]/i,
    /<script[\s>]/i,
  ],
  css: [
    /[.#]?[A-Za-z_-][\w-]*\s*\{/,
    /\b(?:display|position|margin|padding|color|background)\s*:/i,
    /@media\b/i,
    /@keyframes\b/i,
  ],
};

const LANGUAGE_STRONG_SIGNATURES = {
  javascript: [/=>/, /\bfunction\s+\w+\s*\(/, /\bimport\s+.*\sfrom\s+['"]/, /\bconsole\.log\s*\(/],
  typescript: [/\binterface\s+\w+/, /\btype\s+\w+\s*=/, /\b(?:enum|implements|readonly)\b/, /:\s*(?:string|number|boolean|unknown|any|Record<|Array<|Promise<)/],
  python: [/\bdef\s+\w+\s*\(/, /\bclass\s+\w+\s*:/, /\bprint\s*\(/, /\bimport\s+\w+/],
  java: [/\bpublic\s+class\s+\w+/, /\bpublic\s+static\s+void\s+main\s*\(/, /\bSystem\.out\.println\s*\(/, /\bimport\s+java\./],
  cpp: [/\b#include\s*<[^>]+>/, /\busing\s+namespace\s+std\s*;/, /\bstd::[A-Za-z_]\w*/, /\bint\s+main\s*\(/],
  c: [/\b#include\s*<[^>]+>/, /\bprintf\s*\(/, /\bscanf\s*\(/, /\bint\s+main\s*\(/],
  csharp: [/\busing\s+System\s*;/, /\bConsole\.WriteLine\s*\(/, /\bnamespace\s+\w+/],
  go: [/\bpackage\s+main\b/, /\bfunc\s+main\s*\(/, /\bfmt\.Print(?:ln|f)?\s*\(/, /\b:=\s*/],
  rust: [/\bfn\s+main\s*\(\)/, /\bprintln!\s*\(/, /\blet\s+mut\b/, /\buse\s+std::/],
  ruby: [/\bdef\s+\w+/, /\bputs\s+/, /\bclass\s+\w+/, /\brequire\s+['"]/],
  php: [/<\?php/, /\becho\s+/, /\$\w+/],
  swift: [/\bimport\s+Foundation\b/, /\bfunc\s+\w+\s*\(/, /\b(?:let|var)\s+\w+\s*:/],
  kotlin: [/\bfun\s+main\s*\(/, /\bprintln\s*\(/, /\bdata\s+class\s+\w+/],
  sql: [/\bSELECT\b/i, /\bFROM\b/i, /\bCREATE\s+TABLE\b/i],
  html: [/<!doctype\s+html>/i, /<html[\s>]/i, /<body[\s>]/i],
  css: [/@media\b/i, /@keyframes\b/i, /\b(?:display|position|margin|padding|color|background)\s*:/i],
};

const LANGUAGE_LABELS = Object.fromEntries(LANGUAGES.map((item) => [item.value, item.label]));

const scoreLanguage = (code, language) => {
  const basicScore = (LANGUAGE_SIGNATURES[language] || []).reduce(
    (score, pattern) => score + (pattern.test(code) ? 1 : 0),
    0
  );
  const strongScore = (LANGUAGE_STRONG_SIGNATURES[language] || []).reduce(
    (score, pattern) => score + (pattern.test(code) ? 2 : 0),
    0
  );
  return basicScore + strongScore;
};

export const detectLanguageFromCode = (code = '') => {
  const normalizedCode = String(code || '');
  const trimmed = normalizedCode.trim();

  if (trimmed.length < 12) {
    return { language: null, score: 0, confidence: 'low', ambiguous: false };
  }

  const scored = LANGUAGES
    .map((language) => ({
      value: language.value,
      score: scoreLanguage(normalizedCode, language.value),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const runnerUp = scored[1];

  if (!best || best.score < 2) {
    return { language: null, score: 0, confidence: 'low', ambiguous: false };
  }

  const gap = best.score - (runnerUp?.score || 0);
  const ambiguous = Boolean(runnerUp && gap < 2);

  if (ambiguous && best.score < 5) {
    return { language: null, score: best.score, confidence: 'low', ambiguous: true };
  }

  const confidence = best.score >= 6 && gap >= 2 ? 'high' : best.score >= 4 ? 'medium' : 'low';

  return { language: best.value, score: best.score, confidence, ambiguous };
};

export const buildLanguageValidationDiagnostics = ({
  code = '',
  selectedLanguage = '',
  detectedLanguage = null,
  detectedScore = 0,
}) => {
  const diagnostics = [];
  const selectedLabel = LANGUAGE_LABELS[selectedLanguage] || selectedLanguage;
  const detectedLabel = detectedLanguage ? LANGUAGE_LABELS[detectedLanguage] || detectedLanguage : '';

  if (detectedLanguage && selectedLanguage && detectedLanguage !== selectedLanguage) {
    diagnostics.push({
      severity: 'error',
      lineNumber: 1,
      column: 1,
      message: `Language mismatch: code looks like ${detectedLabel}, but ${selectedLabel} is selected.`,
      source: 'STACKMIND',
    });
  }

  const trimmed = String(code || '').trim();
  if (trimmed.length === 0) {
    return diagnostics;
  }

  if (!detectedLanguage && detectedScore > 0) {
    diagnostics.push({
      severity: 'warning',
      lineNumber: 1,
      column: 1,
      message: 'Language detection is ambiguous. Add a few more lines or select the language manually.',
      source: 'STACKMIND',
    });
  }

  return diagnostics;
};
