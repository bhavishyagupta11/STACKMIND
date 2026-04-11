const Review = require('../models/Review');
const { analyzeCode } = require('../services/geminiService');
const { detectLanguageFromCode } = require('../utils/languageDetection');
const { createReview: createLocalReview } = require('../services/localStore');

const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
};

// @desc    Submit code for AI review
// @route   POST /api/review
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const {
      code,
      language,
      interviewMode = false,
      focusAreas = [],
      customInstructions = '',
      contextNotes = '',
    } = req.body;

    // Input validation
    if (!code || code.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }
    if (!language) {
      return res.status(400).json({ success: false, message: 'Language is required' });
    }
    if (code.length > 50000) {
      return res.status(400).json({ success: false, message: 'Code exceeds maximum length of 50,000 characters' });
    }
    if (!Array.isArray(focusAreas)) {
      return res.status(400).json({ success: false, message: 'Focus areas must be an array' });
    }
    if (customInstructions.length > 2000) {
      return res.status(400).json({ success: false, message: 'Custom instructions must be 2,000 characters or less' });
    }
    if (contextNotes.length > 3000) {
      return res.status(400).json({ success: false, message: 'Context notes must be 3,000 characters or less' });
    }

    const detected = detectLanguageFromCode(code);
    if (detected.language && detected.language !== language) {
      const detectedLabel = LANGUAGE_LABELS[detected.language] || detected.language;
      const selectedLabel = LANGUAGE_LABELS[language] || language;
      return res.status(422).json({
        success: false,
        message: `Language mismatch: this code looks like ${detectedLabel}, but you selected ${selectedLabel}.`,
        detectedLanguage: detected.language,
        selectedLanguage: language,
      });
    }

    // Call Gemini (or fallback)
    const {
      parsed,
      rawResponse,
      isFallback,
      fallbackReason = '',
      providerUsed = '',
      modelUsed = '',
      usedBackup = false,
    } = await analyzeCode({
      code,
      language,
      interviewMode,
      focusAreas,
      customInstructions,
      contextNotes,
    });

    const reviewPayload = {
      userId: req.user._id,
      code,
      language,
      interviewMode,
      focusAreas,
      customInstructions: customInstructions.trim(),
      contextNotes: contextNotes.trim(),
      response: parsed,
      rawResponse,
      isFallback,
    };

    const review = req.app.locals.persistenceMode === 'local'
      ? await createLocalReview(reviewPayload)
      : await Review.create(reviewPayload);

    res.status(201).json({
      success: true,
      message: isFallback ? 'Review completed (fallback mode)' : 'Review completed',
      isFallback,
      fallbackReason,
      providerUsed,
      modelUsed,
      usedBackup,
      review: {
        id: review._id,
        language: review.language,
        interviewMode: review.interviewMode,
        focusAreas: review.focusAreas,
        customInstructions: review.customInstructions,
        contextNotes: review.contextNotes,
        response: review.response,
        isFallback: review.isFallback,
        fallbackReason,
        providerUsed,
        modelUsed,
        usedBackup,
        createdAt: review.createdAt,
        title: review.title,
        code: review.code,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReview };
