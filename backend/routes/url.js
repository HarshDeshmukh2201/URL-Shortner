const express = require("express")
const { handleGenerateNewShortURL, handleGetAnalytics, handleTrackCopy, handleGetHistory } = require("../controllers/url")

const router = express.Router()

// POST /api/url - Create short URL
router.post('/', handleGenerateNewShortURL)

// GET /api/url/analytics?shortId=xxx - Get analytics for a short URL
router.get('/analytics', handleGetAnalytics)

// POST /api/url/copy - Track a copy event for a short URL
router.post('/copy', handleTrackCopy)

// GET /api/url/history - List recently created short URLs
router.get('/history', handleGetHistory)

module.exports = router;
