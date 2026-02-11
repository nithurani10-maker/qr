const express = require('express');
const router = express.Router();
const { analyzeScan, getScanHistory, getScanById, getBlacklistStatus, getIntelligence, analyzeDomain, checkBlacklist } = require('../controllers/scanController');

router.post('/analyze', analyzeScan);
router.get('/history', getScanHistory);

router.get('/domain/analyze', analyzeDomain);
router.get('/domain/blacklist-check', checkBlacklist);

router.get('/blacklist', getBlacklistStatus);
router.get('/intelligence', getIntelligence);
router.get('/:id', getScanById);

module.exports = router;
