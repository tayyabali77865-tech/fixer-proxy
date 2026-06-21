const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
  const { playerUrl, streamUrl } = req.query;

  if (playerUrl) {
    const headers = {
      'Referer': 'https://netmirror.global/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    try {
      const response = await fetch(playerUrl, { headers });
      const text = await response.text();
      res.setHeader('Content-Type', 'text/html');
      res.status(response.status).send(text);
    } catch (err) {
      res.status(500).send(err.message);
    }
    return;
  }

  if (streamUrl) {
    const range = req.headers.range || 'bytes=0-';
    const headers = {
      'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Range': range,
      'Referer': 'https://fmoviesunblocked.net/',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    try {
      const response = await fetch(streamUrl, { headers });
      res.status(response.status);
      
      res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      const contentRange = response.headers.get('content-range');
      if (contentRange) res.setHeader('Content-Range', contentRange);

      const contentLength = response.headers.get('content-length');
      if (contentLength) res.setHeader('Content-Length', contentLength);

      response.body.pipe(res);
    } catch (err) {
      res.status(500).send(err.message);
    }
    return;
  }

  res.status(400).send('Missing parameters');
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
