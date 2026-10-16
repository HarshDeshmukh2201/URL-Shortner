
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require('./DB/connect');
const URL = require('./models/url');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// URL routes
app.use('/api/url', urlRoute);

// Redirect route
app.get('/:shortId', async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: 'URL not found' });
    }

    return res.redirect(entry.redirectURL);
  } catch (err) {
    console.error('Redirect error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
