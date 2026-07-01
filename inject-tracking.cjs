#!/usr/bin/env node
/**
 * inject-tracking.cjs — ensure every HTML page loads /track.js (the delegated
 * CTA event tracker). Idempotent: skips pages that already include it.
 * Inserts right before </head> so it parses early (defer = non-blocking).
 * Run with --dry to preview.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const DRY = process.argv.includes('--dry');
const TAG = '<script src="/track.js" defer></script>';
const SKIP_DIRS = ['node_modules', '.vercel', '.git', 'docs', 'playwright-report', '.playwright-mcp', 'tests', 'test-results', 'posts', 'uploads'];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.includes(e.name)) walk(p, acc); }
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let done = 0, already = 0, noHead = [];
for (const fp of walk(ROOT)) {
  let html = fs.readFileSync(fp, 'utf-8');
  if (html.includes('/track.js')) { already++; continue; }
  if (!/<\/head>/i.test(html)) { noHead.push(path.relative(ROOT, fp)); continue; }
  const out = html.replace(/<\/head>/i, '    ' + TAG + '\n</head>');
  if (!DRY) fs.writeFileSync(fp, out);
  done++;
}
console.log(`${DRY ? '[DRY] ' : ''}injected on ${done} pages | already had it ${already} | no </head> ${noHead.length}`);
noHead.forEach(f => console.log('  ! no </head>: ' + f));
