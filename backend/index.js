const express = require('express')
const cors = require('cors')
const urlRoute = require('./routes/url')
const {connectToMongoDB} = require('./DB/connect')
const URL = require('./models/url')
const app = express()

const PORT = 9000

// Middleware
app.use(cors())
app.use(express.json())

connectToMongoDB("mongodb://localhost:27017/url-shortener").then(() => console.log("MongoDB connected"))

app.use('/api/urlgit init', urlRoute)

// Redirect route
app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  )
  
  if (!entry) {
    return res.status(404).json({ error: "URL not found" })
  }
  
  res.redirect(entry.redirectURL)
})

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))
