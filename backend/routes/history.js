const express = require('express');
const router = express.Router();
const { getHistory, getReviewById, deleteReview } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getHistory);
router.get('/:id', protect, getReviewById);
router.delete('/:id', protect, deleteReview);

module.exports = router;
