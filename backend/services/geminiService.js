const { GoogleGenerativeAI } = require('@google/generative-ai');

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const DEFAULT_OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 30000;

const isOpenRouterKey = (key = '') => key.startsWith('sk-or-v1-');

const getGeminiApiKey = () => {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key || isOpenRouterKey(key)) {
    return '';
  }

  return key;
};

const getOpenRouterApiKey = () => {
  if (process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }

  return isOpenRouterKey(process.env.GEMINI_API_KEY || '') ? process.env.GEMINI_API_KEY : '';
};

const getGenAIClient = () => {
  const geminiApiKey = getGeminiApiKey();
  if (!geminiApiKey) {
    throw new Error('Missing GEMINI_API_KEY in backend environment');
  }

  return new GoogleGenerativeAI(geminiApiKey);
};

const getFallbackReason = (errorMessage = '') => {
  if (!errorMessage) return 'Gemini API request failed';
  if (errorMessage.includes('reported as leaked')) {
    return 'Your Gemini API key has been blocked by Google because it was reported as leaked';
  }
  if (errorMessage.includes('404 Not Found') || errorMessage.includes('is not found for API version')) {
    return `The configured Gemini model is unavailable. Try a supported model such as ${DEFAULT_GEMINI_MODEL}`;
  }
  if (errorMessage.includes('API key not valid')) {
    return 'Your Gemini API key is invalid';
  }
  if (errorMessage.includes('quota')) {
    return 'Gemini API quota was exceeded';
  }
  if (errorMessage.includes('timeout')) {
    return 'Gemini API request timed out';
  }
  return errorMessage;
};

// ─── Build the prompt exactly as specified ───────────────────────────────────
const buildPrompt = ({ code, language, interviewMode, focusAreas = [], customInstructions = '', contextNotes = '' }) => {
  const focusList = focusAreas.length ? focusAreas.join(', ') : 'general correctness, maintainability, and performance';
  const extraInstructions = customInstructions.trim() || 'No additional custom instructions provided.';
  const extraContext = contextNotes.trim() || 'No extra project context provided.';

  return `You are a senior software engineer, code reviewer, and technical interviewer.
Analyze the given code and respond ONLY in structured format:

🧭 TL;DR Summary
🧠 Code Understanding
🔥 Risk Hotspots
❌ Bugs / Issues
⚙️ Time & Space Complexity
🚀 Optimization Suggestions
🧹 Code Quality Review
🧪 Testing Recommendations
📐 Conventions Alignment
🪜 Change Walkthrough
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
Use plain readable text only.
Do not use markdown bold, bullet asterisks, code fences, backticks, or quoted variable names unless absolutely necessary.
If you compare multiple implementations, separate them with short labels like "Implementation 1:", "Implementation 2:", and keep each on its own paragraph.
Language: ${language}
Interview Mode: ${interviewMode ? 'ON' : 'OFF'}
Focus Areas: ${focusList}
Project Context:
${extraContext}

Custom Review Instructions:
${extraInstructions}

Code:
\`\`\`${language}
${code}
\`\`\``;
};

const cleanSectionContent = (content = '') =>
  content
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*[:;,.]+\s*$/gm, '')
    .replace(/^\s*[:;]\s+/gm, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const normalizeResponseText = (text = '') =>
  text
    .replace(/\r\n/g, '\n')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/^\s*\*\*(🧭|🧠|🔥|❌|⚙️|🚀|🧹|🧪|📐|🪜|⚠️|💡|📊|🎤|❓)/gm, '$1')
    .replace(/(Summary|Understanding|Hotspots|Issues|Complexity|Suggestions|Review|Recommendations|Alignment|Walkthrough|Cases|Code|Verdict|Explanation|Questions)\*\*/g, '$1')
    .trim();

// ─── Parse Gemini/OpenRouter raw text into structured sections ───────────────
const parseResponse = (text) => {
  const sections = {
    summary: '',
    codeUnderstanding: '',
    riskHotspots: '',
    bugsIssues: '',
    complexity: '',
    optimizationSuggestions: '',
    codeQuality: '',
    testRecommendations: '',
    conventionsAlignment: '',
    walkthrough: '',
    edgeCases: '',
    improvedCode: '',
    finalVerdict: '',
    interviewExplanation: '',
    followUpQuestions: '',
  };

  const normalizedText = normalizeResponseText(text);

  // Map emoji headers to section keys
  const sectionMap = [
    { key: 'summary', markers: ['🧭 TL;DR Summary', '🧭 TL;DR', '🧭 Summary'] },
    { key: 'codeUnderstanding', markers: ['🧠 Code Understanding', '🧠Code Understanding'] },
    { key: 'riskHotspots', markers: ['🔥 Risk Hotspots', '🔥Risk Hotspots'] },
    { key: 'bugsIssues', markers: ['❌ Bugs / Issues', '❌ Bugs/Issues', '❌Bugs / Issues'] },
    { key: 'complexity', markers: ['⚙️ Time & Space Complexity', '⚙️Time & Space Complexity'] },
    { key: 'optimizationSuggestions', markers: ['🚀 Optimization Suggestions', '🚀Optimization Suggestions'] },
    { key: 'codeQuality', markers: ['🧹 Code Quality Review', '🧹Code Quality Review'] },
    { key: 'testRecommendations', markers: ['🧪 Testing Recommendations', '🧪Testing Recommendations'] },
    { key: 'conventionsAlignment', markers: ['📐 Conventions Alignment', '📐Conventions Alignment'] },
    { key: 'walkthrough', markers: ['🪜 Change Walkthrough', '🪜Change Walkthrough'] },
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
      const idx = normalizedText.indexOf(marker);
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
    const end = i + 1 < positions.length ? positions[i + 1].index : normalizedText.length;
    sections[positions[i].key] = cleanSectionContent(normalizedText.slice(start, end));
  }

  const nonEmptySectionCount = Object.values(sections).filter(Boolean).length;
  if (nonEmptySectionCount < 3) {
    sections.codeUnderstanding =
      cleanSectionContent(normalizedText) || 'The AI response could not be split into structured sections.';
  }

  return sections;
};

const normalizeTextContent = (content) => {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part?.type === 'text') return part.text || '';
        return '';
      })
      .join('\n')
      .trim();
  }

  return '';
};

const withTimeout = async (promiseFactory, label) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timeout after 30s`)), REQUEST_TIMEOUT_MS)
  );

  return Promise.race([promiseFactory(), timeoutPromise]);
};

const callGemini = async (prompt) => {
  if (!getGeminiApiKey()) {
    throw new Error('Direct Gemini API key is not configured');
  }

  const genAI = getGenAIClient();
  const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
  const result = await withTimeout(() => model.generateContent(prompt), 'Gemini API');
  const rawText = result.response.text();

  if (!rawText?.trim()) {
    throw new Error('Gemini returned an empty response');
  }

  return {
    providerUsed: 'gemini',
    modelUsed: DEFAULT_GEMINI_MODEL,
    rawText,
  };
};

const callOpenRouter = async (prompt) => {
  const openRouterApiKey = getOpenRouterApiKey();
  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key is not configured');
  }

  const response = await withTimeout(
    () =>
      fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'STACKMIND',
        },
        body: JSON.stringify({
          model: DEFAULT_OPENROUTER_MODEL,
          messages: [{ role: 'user', content: prompt }],
        }),
      }),
    'OpenRouter API'
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenRouter request failed with status ${response.status}`);
  }

  const rawText = normalizeTextContent(data?.choices?.[0]?.message?.content);
  if (!rawText) {
    throw new Error('OpenRouter returned an empty response');
  }

  return {
    providerUsed: 'openrouter',
    modelUsed: DEFAULT_OPENROUTER_MODEL,
    rawText,
  };
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
    summary: `Fallback static review for ${language}. ${lineCount} lines analyzed with emphasis on reliability, maintainability, and basic performance signals.`,
    codeUnderstanding: `[Fallback Analysis — Gemini unavailable]\nLanguage: ${language}\nLines of code: ${lineCount}\nThis is a static rule-based analysis. For full AI-powered review, ensure Gemini API is configured correctly.`,
    riskHotspots: bugs.length > 0 ? bugs.join('\n\n') : 'No major hotspots detected from static heuristics.',
    bugsIssues: bugs.length > 0 ? bugs.join('\n\n') : 'No obvious bugs detected in static analysis.',
    complexity: `Time Complexity: ${timeComplexity}\nSpace Complexity: ${spaceComplexity}`,
    optimizationSuggestions: optimizations.length > 0 ? optimizations.join('\n\n') : 'No major optimizations identified in static analysis.',
    codeQuality: qualityIssues.length > 0 ? qualityIssues.join('\n\n') : 'Code quality looks acceptable at a surface level.',
    testRecommendations: 'Add tests for empty inputs, invalid values, happy-path behavior, and boundary conditions.',
    conventionsAlignment: 'Fallback mode cannot infer full team conventions. Check naming consistency, function size, and error-handling style manually.',
    walkthrough: 'Review the main execution path first, then inspect nested loops, unchecked inputs, and exception-prone branches.',
    edgeCases: edgeCases.length > 0 ? edgeCases.join('\n\n') : 'Consider testing with empty inputs, null values, and boundary conditions.',
    improvedCode: '// Fallback mode: Full improved code requires Gemini API.\n// Ensure GEMINI_API_KEY is set in your .env file.',
    finalVerdict: `⚠️ Fallback analysis only. Gemini API was unreachable.\nStatic checks found ${bugs.length} potential bug(s), ${qualityIssues.length} quality issue(s).`,
    interviewExplanation: interviewMode ? 'Fallback mode active. Interview explanation requires Gemini API.' : '',
    followUpQuestions: interviewMode ? 'Fallback mode active. Follow-up questions require Gemini API.' : '',
  };
};

// ─── Main Service Function ────────────────────────────────────────────────────
const analyzeCode = async ({ code, language, interviewMode, focusAreas, customInstructions, contextNotes }) => {
  const prompt = buildPrompt({ code, language, interviewMode, focusAreas, customInstructions, contextNotes });
  const providerErrors = [];

  try {
    const { rawText, providerUsed, modelUsed } = await callGemini(prompt);
    const parsed = parseResponse(rawText);

    return { parsed, rawResponse: rawText, isFallback: false, providerUsed, modelUsed, usedBackup: false };
  } catch (geminiError) {
    const geminiFailureReason = getFallbackReason(geminiError.message);
    providerErrors.push(`Gemini: ${geminiFailureReason}`);
    console.warn('⚠️ Gemini API failed, trying OpenRouter backup:', geminiFailureReason);
  }

  try {
    const { rawText, providerUsed, modelUsed } = await callOpenRouter(prompt);
    const parsed = parseResponse(rawText);

    return {
      parsed,
      rawResponse: rawText,
      isFallback: false,
      providerUsed,
      modelUsed,
      usedBackup: true,
      fallbackReason: providerErrors.join(' | '),
    };
  } catch (openRouterError) {
    providerErrors.push(`OpenRouter: ${openRouterError.message}`);
    console.warn('⚠️ OpenRouter backup failed, using static fallback:', openRouterError.message);
    const parsed = fallbackAnalysis(code, language, interviewMode);
    return {
      parsed,
      rawResponse: '',
      isFallback: true,
      fallbackReason: providerErrors.join(' | '),
      providerUsed: 'static-fallback',
      modelUsed: '',
      usedBackup: true,
    };
  }
};

module.exports = { analyzeCode };
