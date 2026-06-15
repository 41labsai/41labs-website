#!/usr/bin/env node
/**
 * optimize-perf.cjs — safe Core Web Vitals wins across all pages (mobile LCP/FCP were poor):
 *  1. Load Google Fonts non-render-blocking (preload + onload swap) with a <noscript> fallback.
 *  2. Add `defer` to script.js (animation JS) so it stops blocking the main thread during load.
 * Idempotent. Does NOT touch analytics (GTM/GA) to avoid breaking tracking.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (['node_modules', '.vercel', '.git', 'api', 'docs', 'playwright-report', '.playwright-mcp', 'tests', 'test-results'].includes(e.name)) continue; walk(p, acc); }
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let fontFixed = 0, deferFixed = 0;
for (const fp of walk(ROOT)) {
  let html = fs.readFileSync(fp, 'utf-8');
  const before = html;

  // 1) Async the Google Fonts stylesheet (render-blocking -> non-blocking)
  // Match: <link href="https://fonts.googleapis.com/css2?...&display=swap" rel="stylesheet">
  html = html.replace(
    /<link href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)" rel="stylesheet">(?!<noscript)/g,
    (m, href) => `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`
  );

  if (html !== before && /onload="this\.onload=null/.test(html) && !before.includes("onload=\"this.onload=null")) fontFixed++;

  // 2) Add defer to script.js (skip GTM/GA/analytics inline scripts)
  const afterFont = html;
  html = html.replace(/<script src="((?:\.\.\/)?\/?script\.js)"><\/script>/g, '<script src="$1" defer></script>');
  if (html !== afterFont) deferFixed++;

  if (html !== before) fs.writeFileSync(fp, html);
}
console.log(`Fonts made async on ${fontFixed} pages; script.js deferred on ${deferFixed} pages.`);
