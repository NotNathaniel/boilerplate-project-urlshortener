require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/:original_url", function(req,res){
  const original_url = req.params.original_url
  dns.lookup(original_url, (err, address, family) => {
    if (err){
    res.json({error: "invalid url"});
  }
    res.json({original_url: address, short_url: family});
});


  res.json({original_url: original_url, short_url: short_url});
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
