export const COMPLEXITY_PRESETS = [
  {
    key: 'O(1)',
    aliases: ['o(1)', 'constant'],
    score: 1,
    hue: 'emerald',
    label: 'Constant',
    description: 'Work stays almost flat as input grows.',
    project: (n) => 1,
  },
  {
    key: 'O(log n)',
    aliases: ['o(log n)', 'o(logn)', 'logarithmic'],
    score: 2,
    hue: 'cyan',
    label: 'Logarithmic',
    description: 'Growth is very gentle even for large inputs.',
    project: (n) => Math.max(1, Math.log2(Math.max(n, 2))),
  },
  {
    key: 'O(n)',
    aliases: ['o(n)', 'linear'],
    score: 3,
    hue: 'amber',
    label: 'Linear',
    description: 'Cost scales in direct proportion to input size.',
    project: (n) => n,
  },
  {
    key: 'O(n log n)',
    aliases: ['o(n log n)', 'o(nlogn)', 'linearithmic'],
    score: 4,
    hue: 'orange',
    label: 'Linearithmic',
    description: 'Common for efficient sorting and divide-and-conquer.',
    project: (n) => n * Math.log2(Math.max(n, 2)),
  },
  {
    key: 'O(n^2)',
    aliases: ['o(n^2)', 'o(n²)', 'quadratic'],
    score: 5,
    hue: 'rose',
    label: 'Quadratic',
    description: 'Gets expensive quickly as inputs grow.',
    project: (n) => n * n,
  },
  {
    key: 'O(n^3)',
    aliases: ['o(n^3)', 'o(n³)', 'cubic'],
    score: 6,
    hue: 'red',
    label: 'Cubic',
    description: 'Heavy growth that usually needs optimization.',
    project: (n) => n * n * n,
  },
  {
    key: 'O(2^n)',
    aliases: ['o(2^n)', 'o(2ⁿ)', 'exponential'],
    score: 7,
    hue: 'fuchsia',
    label: 'Exponential',
    description: 'Explodes very fast as input grows.',
    project: (n) => Math.pow(2, Math.min(n, 20)),
  },
  {
    key: 'O(n!)',
    aliases: ['o(n!)', 'factorial'],
    score: 8,
    hue: 'violet',
    label: 'Factorial',
    description: 'Brute-force territory with severe scaling costs.',
    project: (n) => {
      let total = 1;
      for (let i = 2; i <= Math.min(n, 10); i += 1) total *= i;
      return total;
    },
  },
];

const INPUT_SIZES = [10, 100, 1000, 10000];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeText = (text = '') => text.toLowerCase().replace(/\s+/g, ' ').trim();

const fallbackPreset = COMPLEXITY_PRESETS[2];

const getPresetByKey = (key = '') =>
  COMPLEXITY_PRESETS.find((preset) => preset.key === key) || null;

const getPresetForExpression = (expression = '') => {
  const normalized = normalizeText(expression);
  
  const preset = COMPLEXITY_PRESETS.find((preset) =>
    preset.aliases.some((alias) => normalized.includes(alias))
  );
  if (preset) return preset;

  if (/o\([^)]*\^3[^)]*\)/.test(normalized) || /o\([^)]*³[^)]*\)/.test(normalized) || /\bcubic\b/.test(normalized)) {
    return getPresetByKey('O(n^3)');
  }
  if (/o\([^)]*\^2[^)]*\)/.test(normalized) || /o\([^)]*²[^)]*\)/.test(normalized) || /\bquadratic\b/.test(normalized) || /o\([^)]*[a-z]\s*\*\s*[a-z][^)]*\)/.test(normalized)) {
    return getPresetByKey('O(n^2)');
  }
  if (/o\([^)]*[a-z]\s*log\s*[a-z][^)]*\)/.test(normalized) || /\blinearithmic\b/.test(normalized)) {
    return getPresetByKey('O(n log n)');
  }
  if (/o\([^)]*log\s*[a-z][^)]*\)/.test(normalized) || /\blogarithmic\b/.test(normalized)) {
    return getPresetByKey('O(log n)');
  }
  if (/o\([^)]*2\^[a-z][^)]*\)/.test(normalized) || /\bexponential\b/.test(normalized)) {
    return getPresetByKey('O(2^n)');
  }
  if (/o\([^)]*[a-z]![^)]*\)/.test(normalized) || /\bfactorial\b/.test(normalized)) {
    return getPresetByKey('O(n!)');
  }
  if (/o\([^)]*[a-z](?:\s*\+\s*[a-z])?[^)]*\)/.test(normalized) || /\blinear\b/.test(normalized)) {
    return getPresetByKey('O(n)');
  }
  if (/\bconstant\b/.test(normalized)) {
    return getPresetByKey('O(1)');
  }

  return null;
};

const extractExpressionByLabel = (text, label) => {
  const regex = new RegExp(`${label}\\s*[:\\-]\\s*([^\\n]+)`, 'i');
  const match = text.match(regex);
  if (!match) return '';
  const bigOMatch = match[1].match(/O\([^)]+\)/i);
  return bigOMatch ? bigOMatch[0] : match[1].trim();
};

const extractCandidateExpressions = (text = '') => {
  const matches = [...text.matchAll(/O\([^)]+\)/gi)].map((match) => match[0]);
  return Array.from(new Set(matches));
};

const parseComplexityDimension = (text, type) => {
  const labeled = extractExpressionByLabel(text, type === 'time' ? 'time complexity' : 'space complexity');
  const candidates = extractCandidateExpressions(text);
  const rawExpression =
    labeled ||
    (type === 'time' ? candidates[0] : candidates[1]) ||
    candidates[0] ||
    fallbackPreset.key;
  const preset = getPresetForExpression(rawExpression) || fallbackPreset;

  let displayExpression = rawExpression;
  let bigOMatch = String(rawExpression).match(/O\([^)]+\)/i);
  if (bigOMatch) {
    displayExpression = bigOMatch[0];
  } else if (displayExpression.length > 20 || !/^O\(/i.test(displayExpression)) {
    displayExpression = preset.key;
  }

  return {
    key: preset.key,
    expression: displayExpression,
    score: preset.score,
    label: preset.label,
    description: preset.description,
    hue: preset.hue,
    project: preset.project,
  };
};

const summarizeCodeSignals = (code = '') => {
  const lineCount = code.split('\n').filter((line) => line.trim()).length;
  const loopCount = (code.match(/\b(for|while)\b/g) || []).length;
  const nestedLoop = /for\s*\([\s\S]{0,200}?for\s*\(|while\s*\([\s\S]{0,200}?while\s*\(|for\s*\([\s\S]{0,200}?while\s*\(|while\s*\([\s\S]{0,200}?for\s*\(/i.test(code);
  const recursion = (() => {
    const functionNames = [
      ...code.matchAll(/function\s+([a-zA-Z_$][\w$]*)\s*\(/g),
      ...code.matchAll(/const\s+([a-zA-Z_$][\w$]*)\s*=\s*\([^)]*\)\s*=>/g),
      ...code.matchAll(/def\s+([a-zA-Z_][\w]*)\s*\(/g),
    ].map((match) => match[1]);

    return functionNames.some((name) => {
      const regex = new RegExp(`\\b${escapeRegExp(name)}\\s*\\(`, 'g');
      const hits = code.match(regex) || [];
      return hits.length > 1;
    });
  })();
  const auxStructures = (code.match(/\b(new\s+Map|new\s+Set|new\s+Array|new\s+Object|Map\(|Set\(|\[\]|\{\}|push\(|append\(|unshift\()/g) || []).length;

  const insights = [];
  if (nestedLoop) insights.push('Nested iteration detected');
  if (recursion) insights.push('Recursive call pattern detected');
  if (auxStructures > 0) insights.push('Auxiliary data structures are in play');
  if (insights.length === 0) insights.push('No major structural red flags detected');

  return {
    lineCount,
    loopCount,
    nestedLoop,
    recursion,
    auxStructures,
    insights,
  };
};

const buildProjection = (dimension) => {
  const values = INPUT_SIZES.map((size) => dimension.project(size));
  const max = Math.max(...values, 1);

  return INPUT_SIZES.map((size, index) => ({
    size,
    width: clamp(Math.round((values[index] / max) * 100), 8, 100),
  }));
};

const getHeadline = (timeScore, spaceScore, signals) => {
  if (timeScore >= 7) return 'This solution will struggle hard on large inputs.';
  if (timeScore >= 5) return 'This solution is acceptable for small inputs but scales aggressively.';
  if (timeScore === 4) return 'This is a healthy middle ground for non-trivial workloads.';
  if (timeScore <= 3 && spaceScore <= 3) return 'This solution scales cleanly for typical interview-sized inputs.';
  if (signals.auxStructures > 0) return 'Time looks controlled, but memory usage deserves a quick check.';
  return 'Overall scaling looks reasonable from the current review.';
};

const inferOptimizationTarget = (optimizationText, currentTime) => {
  const normalized = normalizeText(optimizationText);
  const currentPreset = getPresetByKey(currentTime.key) || fallbackPreset;

  if (!normalized) {
    return currentPreset.score > 3 ? COMPLEXITY_PRESETS[currentPreset.score - 2] || currentPreset : null;
  }

  if (/(binary search|divide and conquer)/i.test(normalized)) {
    return getPresetByKey('O(log n)');
  }

  if (/(hash map|hashmap|map lookup|set lookup|memoization|dynamic programming|cache)/i.test(normalized)) {
    return getPresetByKey('O(n)');
  }

  if (/(sorting|sort first|two pointers|two-pointer|merge sort|heap)/i.test(normalized)) {
    return getPresetByKey('O(n log n)');
  }

  if (/(remove nested loops|avoid nested loops|replace nested loops)/i.test(normalized) && currentPreset.score >= 5) {
    return getPresetByKey('O(n)');
  }

  if (currentPreset.score > 3) {
    return COMPLEXITY_PRESETS[currentPreset.score - 2] || currentPreset;
  }

  return null;
};

export const parseComplexityInsights = ({ complexityText = '', optimizationText = '', code = '' }) => {
  const time = parseComplexityDimension(complexityText, 'time');
  const space = parseComplexityDimension(complexityText, 'space');
  const signals = summarizeCodeSignals(code);
  const optimizationTarget = inferOptimizationTarget(optimizationText, time);

  return {
    time,
    space,
    signals,
    optimizationTarget,
    timeProjection: buildProjection(time),
    spaceProjection: buildProjection(space),
    headline: getHeadline(time.score, space.score, signals),
  };
};
