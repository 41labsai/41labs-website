#!/usr/bin/env node
/**
 * defer-analytics.cjs — load GTM + GA4 off the critical path (on first interaction, or a 4s
 * fallback so non-interacting visits still register). This frees the main thread during load,
 * cutting TBT and improving mobile LCP/FCP. Tradeoff: bounces shorter than ~4s with no
 * interaction won't be tracked — accepted for CWV.
 *
 * Safety: only inserts the deferred loader on a page where it SUCCESSFULLY removed the original
 * GA4 block (so we never double-count). Run with --dry to preview.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const DRY = process.argv.includes('--dry');

const GA4 = /(?:<!-- Google Analytics 4 -->\s*)?<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-VQQ49H8N1L"><\/script>\s*<script>[\s\S]*?gtag\(\s*'config'\s*,\s*'G-VQQ49H8N1L'\s*\);?\s*<\/script>/;
const GTM = /(?:<!-- Google Tag Manager -->\s*)?<script>\(function\(w,d,s,l,i\)\{[\s\S]*?GTM-WQJF7DK7[\s\S]*?<\/script>(?:\s*<!-- End Google Tag Manager -->)?/;

const LOADER = `    <script>/* deferred analytics for Core Web Vitals: load on first interaction or after 4s */
    (function(){var loaded=false;function load(){if(loaded)return;loaded=true;
      var g=document.createElement('script');g.async=1;g.src='https://www.googletagmanager.com/gtag/js?id=G-VQQ49H8N1L';document.head.appendChild(g);
      window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','G-VQQ49H8N1L');
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WQJF7DK7');}
      var e=['scroll','mousemove','touchstart','click','keydown'];e.forEach(function(n){window.addEventListener(n,load,{once:true,passive:true});});setTimeout(load,4000);})();
    </script>
</head>`;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (['node_modules', '.vercel', '.git', 'api', 'docs', 'playwright-report', '.playwright-mcp', 'tests', 'test-results'].includes(e.name)) continue; walk(p, acc); }
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let done = 0, skipNoGa = 0, flagged = [], already = 0;
for (const fp of walk(ROOT)) {
  let html = fs.readFileSync(fp, 'utf-8');
  if (html.includes('deferred analytics for Core Web Vitals')) { already++; continue; }
  const hasGA = html.includes('gtag/js?id=G-VQQ49H8N1L');
  if (!hasGA) { skipNoGa++; continue; }
  const ga4ok = GA4.test(html);
  if (!ga4ok) { flagged.push(path.relative(ROOT, fp)); continue; } // don't touch — avoid double-count
  let out = html.replace(GA4, '').replace(GTM, '');
  if (out.includes('gtag/js?id=G-VQQ49H8N1L')) { flagged.push(path.relative(ROOT, fp) + ' (GA leftover)'); continue; }
  out = out.replace('</head>', LOADER);
  if (!DRY) fs.writeFileSync(fp, out);
  done++;
}
console.log(`${DRY ? '[DRY] ' : ''}deferred on ${done} pages | already done ${already} | no-GA ${skipNoGa} | FLAGGED (left untouched) ${flagged.length}`);
flagged.slice(0, 15).forEach(f => console.log('  ! ' + f));
