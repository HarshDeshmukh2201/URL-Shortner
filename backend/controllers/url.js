const { nanoid } = require("nanoid");
const URL = require("../models/url");

const handleGenerateNewShortURL = async (req, res) => {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }
  const shortId = nanoid(8);

  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.status(201).json({ shortId, message: "URL created successfully" });
};

const handleGetAnalytics = async (req, res) => {
  const { shortId } = req.query;
  if (!shortId) {
    return res.status(400).json({ error: "shortId is required" });
  }
  const result = await URL.findOne({ shortId });
  
  if (!result) {
    return res.status(404).json({ error: "URL not found" });
  }
  
  return res.json({
    shortId: result.shortId,
    totalClick: result.visitHistory.length,
    analytics: result.visitHistory,
  });
};

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
