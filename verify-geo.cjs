#!/usr/bin/env node
/**
 * verify-geo.cjs — asserts the GEO/SEO invariants for 41labs.ai. Exits non-zero on failure.
 * Run after any content/build change: `node verify-geo.cjs`
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf-8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

let failures = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => { console.log(`  ✗ ${m}`); failures++; };

const postsRaw = JSON.parse(read('posts.json'));
const posts = Array.isArray(postsRaw) ? postsRaw : postsRaw.posts;
const csRaw = JSON.parse(read('case-studies.json'));
const cases = Array.isArray(csRaw) ? csRaw : (csRaw.caseStudies || Object.values(csRaw).find(Array.isArray));
const sitemap = read('sitemap.xml');
const home = read('index.html');
const robots = read('robots.txt');

console.log('Blog posts static + crawlable:');
let pm = posts.filter(p => p.slug && !exists(`blog/${p.slug}.html`));
pm.length ? bad(`missing static: ${pm.map(p => p.slug).join(', ')}`) : ok(`all ${posts.length} posts.json posts have static pages`);
pm = posts.filter(p => !sitemap.includes(`/blog/${p.slug}<`));
pm.length ? bad(`missing from sitemap: ${pm.map(p => p.slug).join(', ')}`) : ok('all posts in sitemap');
// no JS-only render in generated pages
let jsLeak = posts.filter(p => exists(`blog/${p.slug}.html`) && /id="post-content"[^>]*>\s*<!--/.test(read(`blog/${p.slug}.html`)));
jsLeak.length ? bad(`JS-shell posts: ${jsLeak.map(p => p.slug).join(', ')}`) : ok('no JS-shell blog pages');

console.log('Case studies static + crawlable:');
let cm = cases.filter(c => !exists(`case-studies/${c.slug}.html`));
cm.length ? bad(`missing static: ${cm.map(c => c.slug).join(', ')}`) : ok(`all ${cases.length} case studies have static pages`);
cm = cases.filter(c => !sitemap.includes(`/case-studies/${c.slug}<`));
cm.length ? bad(`missing from sitemap: ${cm.map(c => c.slug).join(', ')}`) : ok('all case studies in sitemap');

console.log('Homepage proof visible to crawlers:');
const stats = [...home.matchAll(/<span class="stat-number"[^>]*>([^<]*)<\/span>/g)].map(m => m[1].trim());
const zeros = stats.filter(s => /^\$?0%?$/.test(s));
zeros.length ? bad(`stat(s) render as zero: ${zeros.join(', ')}`) : ok(`stats show real values: ${stats.join(', ')}`);

console.log('WhatsApp:');
home.includes('wa-float') ? ok('homepage has floating WhatsApp button') : bad('homepage missing floating WhatsApp button');
home.includes('wa.me/6580124848') ? ok('homepage links company number') : bad('homepage missing company WhatsApp link');
let off = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const fp = path.join(d, e.name); if (e.isDirectory()) { if (['node_modules', '.vercel', '.git'].includes(e.name)) continue; walk(fp); } else if (e.name.endsWith('.html') && fs.readFileSync(fp, 'utf-8').includes('6597848886')) off.push(path.relative(ROOT, fp)); } })(ROOT);
off.length ? bad(`deprecated number in: ${off.join(', ')}`) : ok('deprecated number purged sitewide');

console.log('AI + search crawlers allowed:');
for (const bot of ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'OAI-SearchBot']) {
  new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?Allow:\\s*/`, 'i').test(robots) ? ok(`robots allows ${bot}`) : bad(`robots does not allow ${bot}`);
}
// Traditional search engines (Googlebot/Bingbot) are covered by the wildcard.
/User-agent:\s*\*[\s\S]*?Allow:\s*\//.test(robots) ? ok('robots wildcard allows general crawlers (Googlebot/Bingbot)') : bad('robots wildcard does not allow general crawlers');
/Sitemap:\s*https:\/\/41labs\.ai\/sitemap\.xml/.test(robots) ? ok('sitemap referenced in robots.txt') : bad('sitemap not referenced in robots.txt');

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
