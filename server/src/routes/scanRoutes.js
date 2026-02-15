const express = require('express');
const router = express.Router();
const { analyzeScan, getScanHistory, getScanById } = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

// Public route (but supports auth header for linking)
router.post('/analyze', protect, analyzeScan);

// Fallback for anonymous users if you want to allow it:
// Middleware 'protect' usually blocks if no token. 
// For this app, we want "Optional Auth" for analyze.
// We should update middleware or creating a specific "optionalProtect".
// For now, let's assume we REQUIRE login for saving history, 
// OR we just use a looser middleware manually in the controller.
// But the prompt says "Attach to user" implying auth context.
// Let's make a wrapper for optional auth.
const optionalProtect = async (req, res, next) => {
    if (req.headers.authorization) {
        return protect(req, res, next);
    }
    next();
};

// Re-defining routes with correct middleware
router.post('/analyze', optionalProtect, analyzeScan);
router.get('/history', protect, getScanHistory);
router.get('/history/:id', protect, getScanById);

module.exports = router;
