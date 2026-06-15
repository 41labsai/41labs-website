module.exports = (req, res) => {
  res.statusCode = 410;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>Page not available — 41 Labs</title>
  <link rel="canonical" href="https://41labs.ai/">
  <style>body{font-family:-apple-system,sans-serif;max-width:600px;margin:80px auto;padding:0 20px;line-height:1.7}h1{font-size:1.8em}a{color:#000;font-weight:500}</style>
</head>
<body>
  <h1>This page is not available</h1>
  <p>You followed a link to a URL that doesn't exist on 41 Labs.</p>
  <ul>
    <li><a href="https://41labs.ai/">Home</a></li>
    <li><a href="https://41labs.ai/blog/">Blog</a></li>
    <li><a href="https://41labs.ai/about.html">About</a></li>
  </ul>
</body>
</html>`);
};
