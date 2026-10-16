// Vercel Serverless Function entry point.
// Exports the shared Express app so every route (including /:shortId
// redirects) runs through this single function via the rewrite in vercel.json.
const app = require('../index');

module.exports = app;
