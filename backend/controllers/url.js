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
    copyHistory: [],
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
    totalCopies: result.copyHistory ? result.copyHistory.length : 0,
    copyHistory: result.copyHistory || [],
  });
};

const handleTrackCopy = async (req, res) => {
  const { shortId } = req.body;
  if (!shortId) {
    return res.status(400).json({ error: "shortId is required" });
  }

  const result = await URL.findOneAndUpdate(
    { shortId },
    { $push: { copyHistory: { timestamp: Date.now() } } },
    { new: true }
  );

  if (!result) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.json({
    shortId: result.shortId,
    totalCopies: result.copyHistory.length,
    message: "Copy tracked successfully",
  });
};

const handleGetHistory = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

  const result = await URL.find({})
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .select("shortId redirectURL visitHistory copyHistory createdAt");

  const urls = result.map((doc) => ({
    shortId: doc.shortId,
    redirectURL: doc.redirectURL,
    totalClick: doc.visitHistory ? doc.visitHistory.length : 0,
    totalCopies: doc.copyHistory ? doc.copyHistory.length : 0,
    createdAt: doc.createdAt,
  }));

  return res.json({ count: urls.length, urls });
};

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleTrackCopy,
  handleGetHistory,
};
