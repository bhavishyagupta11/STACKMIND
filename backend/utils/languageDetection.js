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

const getLanguageScore = (code, language) =>
  (LANGUAGE_SIGNATURES[language] || []).reduce((score, pattern) => score + (pattern.test(code) ? 1 : 0), 0);

const detectLanguageFromCode = (code = '') => {
  const normalizedCode = String(code || '');
  const scored = Object.keys(LANGUAGE_SIGNATURES)
    .map((language) => ({
      language,
      score: getLanguageScore(normalizedCode, language),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const runnerUp = scored[1];

  if (!best || best.score < 2) {
    return { language: null, score: 0 };
  }

  if (runnerUp && best.score === runnerUp.score && best.score < 4) {
    return { language: null, score: best.score };
  }

  return { language: best.language, score: best.score };
};

module.exports = { detectLanguageFromCode };
