const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      maxlength: 50000,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    interviewMode: {
      type: Boolean,
      default: false,
    },
    focusAreas: {
      type: [String],
      default: [],
    },
    customInstructions: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    contextNotes: {
      type: String,
      default: '',
      maxlength: 3000,
    },
    // Full structured response from Gemini or fallback analyzer
    response: {
      summary: { type: String, default: '' },
      codeUnderstanding: { type: String, default: '' },
      riskHotspots: { type: String, default: '' },
      bugsIssues: { type: String, default: '' },
      complexity: { type: String, default: '' },
      optimizationSuggestions: { type: String, default: '' },
      codeQuality: { type: String, default: '' },
      testRecommendations: { type: String, default: '' },
      conventionsAlignment: { type: String, default: '' },
      walkthrough: { type: String, default: '' },
      edgeCases: { type: String, default: '' },
      improvedCode: { type: String, default: '' },
      finalVerdict: { type: String, default: '' },
      // Interview mode extras
      interviewExplanation: { type: String, default: '' },
      followUpQuestions: { type: String, default: '' },
    },
    // Raw text fallback in case parsing fails
    rawResponse: { type: String, default: '' },
    // Was this a fallback rule-based analysis?
    isFallback: { type: Boolean, default: false },
    // Short title derived from code snippet for display
    title: { type: String, default: 'Code Review' },
  },
  { timestamps: true }
);

// Auto-generate a short title from the code
ReviewSchema.pre('save', function (next) {
  if (!this.title || this.title === 'Code Review') {
    const lines = this.code.split('\n').filter((l) => l.trim());
    const firstLine = lines[0] ? lines[0].trim().slice(0, 60) : 'Code Review';
    this.title = firstLine || 'Code Review';
  }
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
