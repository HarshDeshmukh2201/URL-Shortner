const express = require("express")
const { handleGenerateNewShortURL, handleGetAnalytics } = require("../controllers/url")

const router = express.Router()

// POST /api/url - Create short URL
router.post('/', handleGenerateNewShortURL)

// GET /api/url/analytics?shortId=xxx - Get analytics for a short URL
router.get('/analytics', handleGetAnalytics)

module.exports = router;
