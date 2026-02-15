const express = require('express');
const router = express.Router();
const { analyzeScan, getScanHistory, getScanById, getBlacklistStatus, getIntelligence, analyzeDomain, checkBlacklist } = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

// Public Analysis (User optional)
const optionalAuth = (req, res, next) => {
    // Custom middleware to check token but not fail if missing
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    next();
};

router.post('/analyze', optionalAuth, analyzeScan);

// Protected Routes
router.get('/history', protect, getScanHistory);
router.get('/:id', optionalAuth, getScanById);

// Utilities
router.get('/domain/analyze', analyzeDomain);
router.get('/domain/blacklist-check', checkBlacklist);

module.exports = router;
