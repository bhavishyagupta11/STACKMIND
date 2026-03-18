const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Build the prompt exactly as specified ───────────────────────────────────
const buildPrompt = (code, language, interviewMode) => {
  return `You are a senior software engineer, code reviewer, and technical interviewer.
Analyze the given code and respond ONLY in structured format:

🧠 Code Understanding
❌ Bugs / Issues
⚙️ Time & Space Complexity
🚀 Optimization Suggestions
🧹 Code Quality Review
⚠️ Edge Cases
💡 Improved Code
📊 Final Verdict
${
  interviewMode
    ? `
🎤 Interview Explanation
❓ Follow-up Questions`
    : ''
}

Be precise, avoid generic advice, justify everything.
Language: ${language}
Interview Mode: ${interviewMode ? 'ON' : 'OFF'}

Code:
\`\`\`${language}
${code}
\`\`\``;
};

// ─── Parse Gemini's raw text into structured sections ────────────────────────
const parseResponse = (text) => {
  const sections = {
    codeUnderstanding: '',
    bugsIssues: '',
    complexity: '',
    optimizationSuggestions: '',
    codeQuality: '',
    edgeCases: '',
    improvedCode: '',
    finalVerdict: '',
    interviewExplanation: '',
    followUpQuestions: '',
  };

  // Map emoji headers to section keys
  const sectionMap = [
    { key: 'codeUnderstanding', markers: ['🧠 Code Understanding', '🧠Code Understanding'] },
    { key: 'bugsIssues', markers: ['❌ Bugs / Issues', '❌ Bugs/Issues', '❌Bugs / Issues'] },
    { key: 'complexity', markers: ['⚙️ Time & Space Complexity', '⚙️Time & Space Complexity'] },
    { key: 'optimizationSuggestions', markers: ['🚀 Optimization Suggestions', '🚀Optimization Suggestions'] },
    { key: 'codeQuality', markers: ['🧹 Code Quality Review', '🧹Code Quality Review'] },
    { key: 'edgeCases', markers: ['⚠️ Edge Cases', '⚠️Edge Cases'] },
    { key: 'improvedCode', markers: ['💡 Improved Code', '💡Improved Code'] },
    { key: 'finalVerdict', markers: ['📊 Final Verdict', '📊Final Verdict'] },
    { key: 'interviewExplanation', markers: ['🎤 Interview Explanation', '🎤Interview Explanation'] },
    { key: 'followUpQuestions', markers: ['❓ Follow-up Questions', '❓Follow-up Questions'] },
  ];

  // Find positions of each section header
  const positions = [];
  for (const section of sectionMap) {
    for (const marker of section.markers) {
      const idx = text.indexOf(marker);
      if (idx !== -1) {
        positions.push({ key: section.key, index: idx, marker });
        break;
      }
    }
  }

  // Sort by position in text
  positions.sort((a, b) => a.index - b.index);

  // Extract content between sections
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index + positions[i].marker.length;
    const end = i + 1 < positions.length ? positions[i + 1].index : text.length;
    sections[positions[i].key] = text.slice(start, end).trim();
  }

  return sections;
};

// ─── Fallback: Rule-Based Static Analysis ────────────────────────────────────
const fallbackAnalysis = (code, language, interviewMode) => {
  const lines = code.split('\n');
  const lineCount = lines.length;
  const codeStr = code.toLowerCase();

  const bugs = [];
  const optimizations = [];
  const edgeCases = [];
  const qualityIssues = [];

  // Detect nested loops → O(n²) warning
  const nestedLoopPattern = /for\s*\(.*\)\s*\{[\s\S]*?for\s*\(|while\s*\(.*\)\s*\{[\s\S]*?while\s*\(/;
  if (nestedLoopPattern.test(code)) {
    bugs.push('⚠️ Nested loops detected — likely O(n²) or worse time complexity.');
    optimizations.push('Consider replacing nested loops with hash maps or sorting-based approaches to reduce complexity.');
  }

  // Detect long functions > 50 lines
  const functionMatches = code.match(/function\s+\w+\s*\(|def\s+\w+\s*\(|=>\s*\{/g);
  if (lineCount > 50) {
    qualityIssues.push(`Function/file is ${lineCount} lines long. Consider breaking it into smaller, single-responsibility functions.`);
  }

  // Missing null/undefined checks
  if (codeStr.includes('undefined') || (!codeStr.includes('null') && !codeStr.includes('none'))) {
    edgeCases.push('Missing null/undefined checks. Ensure all inputs are validated before processing.');
  }

  // No error handling
  if (!codeStr.includes('try') && !codeStr.includes('catch') && !codeStr.includes('except')) {
    bugs.push('No error handling (try/catch) found. Edge cases may cause unhandled exceptions.');
  }

  // Detect console.log / print left in code
  if (codeStr.includes('console.log') || codeStr.includes('print(')) {
    qualityIssues.push('Debug statements (console.log / print) found. Remove before production.');
  }

  // Magic numbers
  const magicNumbers = code.match(/[^a-zA-Z_]\d{2,}[^a-zA-Z_]/g);
  if (magicNumbers && magicNumbers.length > 2) {
    qualityIssues.push('Magic numbers detected. Replace with named constants for readability.');
  }

  // Determine complexity estimate
  let timeComplexity = 'O(n) — estimated based on single loop structure';
  let spaceComplexity = 'O(1) — no significant auxiliary data structures detected';
  if (nestedLoopPattern.test(code)) {
    timeComplexity = 'O(n²) — nested loops detected';
  }
  if (codeStr.includes('[]') || codeStr.includes('{}') || codeStr.includes('list()') || codeStr.includes('array(')) {
    spaceComplexity = 'O(n) — dynamic data structure usage detected';
  }

  return {
    codeUnderstanding: `[Fallback Analysis — Gemini unavailable]\nLanguage: ${language}\nLines of code: ${lineCount}\nThis is a static rule-based analysis. For full AI-powered review, ensure Gemini API is configured correctly.`,
    bugsIssues: bugs.length > 0 ? bugs.join('\n\n') : 'No obvious bugs detected in static analysis.',
    complexity: `Time Complexity: ${timeComplexity}\nSpace Complexity: ${spaceComplexity}`,
    optimizationSuggestions: optimizations.length > 0 ? optimizations.join('\n\n') : 'No major optimizations identified in static analysis.',
    codeQuality: qualityIssues.length > 0 ? qualityIssues.join('\n\n') : 'Code quality looks acceptable at a surface level.',
    edgeCases: edgeCases.length > 0 ? edgeCases.join('\n\n') : 'Consider testing with empty inputs, null values, and boundary conditions.',
    improvedCode: '// Fallback mode: Full improved code requires Gemini API.\n// Ensure GEMINI_API_KEY is set in your .env file.',
    finalVerdict: `⚠️ Fallback analysis only. Gemini API was unreachable.\nStatic checks found ${bugs.length} potential bug(s), ${qualityIssues.length} quality issue(s).`,
    interviewExplanation: interviewMode ? 'Fallback mode active. Interview explanation requires Gemini API.' : '',
    followUpQuestions: interviewMode ? 'Fallback mode active. Follow-up questions require Gemini API.' : '',
  };
};

// ─── Main Service Function ────────────────────────────────────────────────────
const analyzeCode = async (code, language, interviewMode) => {
  // Try Gemini first
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = buildPrompt(code, language, interviewMode);

    // Set a timeout to avoid hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout after 30s')), 30000)
    );

    const geminiPromise = model.generateContent(prompt);
    const result = await Promise.race([geminiPromise, timeoutPromise]);

    const rawText = result.response.text();
    const parsed = parseResponse(rawText);

    return { parsed, rawResponse: rawText, isFallback: false };
  } catch (err) {
    console.warn('⚠️ Gemini API failed, using fallback analysis:', err.message);
    const parsed = fallbackAnalysis(code, language, interviewMode);
    return { parsed, rawResponse: '', isFallback: true };
  }
};

module.exports = { analyzeCode };
