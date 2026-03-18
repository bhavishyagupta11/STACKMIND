const Review = require('../models/Review');
const { analyzeCode } = require('../services/geminiService');

// @desc    Submit code for AI review
// @route   POST /api/review
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { code, language, interviewMode = false } = req.body;

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

    // Call Gemini (or fallback)
    const {
      parsed,
      rawResponse,
      isFallback,
      fallbackReason = '',
      providerUsed = '',
      modelUsed = '',
      usedBackup = false,
    } = await analyzeCode(code, language, interviewMode);

    // Save to database
    const review = await Review.create({
      userId: req.user._id,
      code,
      language,
      interviewMode,
      response: parsed,
      rawResponse,
      isFallback,
    });

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
