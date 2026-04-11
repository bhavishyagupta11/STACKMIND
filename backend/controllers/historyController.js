const Review = require('../models/Review');
const {
  listReviewsByUser,
  countReviewsByUser,
  getReviewById: getLocalReviewById,
  deleteReviewById: deleteLocalReviewById,
} = require('../services/localStore');

// @desc    Get all past reviews for logged-in user
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    if (req.app.locals.persistenceMode === 'local') {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const allReviews = listReviewsByUser(req.user._id);
      const total = countReviewsByUser(req.user._id);
      const skip = (page - 1) * limit;
      const reviews = allReviews.slice(skip, skip + limit).map(({ rawResponse, ...review }) => review);

      return res.json({
        success: true,
        total,
        page,
        pages: Math.ceil(total / limit),
        reviews,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-rawResponse'), // exclude heavy raw field from list
      Review.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single review by ID
// @route   GET /api/history/:id
// @access  Private
const getReviewById = async (req, res, next) => {
  try {
    if (req.app.locals.persistenceMode === 'local') {
      const review = getLocalReviewById(req.user._id, req.params.id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      return res.json({ success: true, review });
    }

    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, review });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a review
// @route   DELETE /api/history/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    if (req.app.locals.persistenceMode === 'local') {
      const review = deleteLocalReviewById(req.user._id, req.params.id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      return res.json({ success: true, message: 'Review deleted' });
    }

    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistory, getReviewById, deleteReview };
