require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');

const app = express();
const port = process.env.PORT || 3000;

// Store URLs in memory (array index = short URL)
const urlDB = [];

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/public', express.static(`${process.cwd()}/public`));

// Index page
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Sample endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// POST: Shorten a URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  let hostname;
  try {
    hostname = new URL(originalUrl).hostname;
  } catch {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, (err, address) => {
    if (err || !address) return res.json({ error: 'invalid url' });

    // Add URL to "database" (in memory)
    const shortUrl = urlDB.push(originalUrl); // push returns new length
    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

// GET: Redirect to original URL
app.get('/api/shorturl/:shortid', (req, res) => {
  const shortid = parseInt(req.params.shortid, 10);
  const originalUrl = urlDB[shortid - 1]; // array is zero-indexed
  if (!originalUrl) return res.json({ error: 'invalid url' });
  res.redirect(originalUrl);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
