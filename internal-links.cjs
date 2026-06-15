#!/usr/bin/env node
/**
 * internal-links.cjs — topical-authority internal linking pass.
 *  A) Fix invisible "Related Articles" headings (white text on the light blog theme).
 *  B) Add Related Articles boxes (light-theme-safe) to the 9 newest posts that lack them,
 *     each including a commercial landing page.
 *  C) Inject a contextual commercial-page link into high-relevance posts so the money pages
 *     (agency / development / sales-agent) receive internal authority from the blog.
 * Idempotent throughout.
 */
const fs = require('fs');
const path = require('path');
const BLOG = path.join(__dirname, 'blog');

const COMMERCIAL = {
  '/ai-automation-agency-singapore': 'AI Automation Agency Singapore',
  '/ai-development-company-singapore': 'AI Development Company Singapore',
  '/ai-sales-agent-singapore': 'AI Sales Agent for Singapore Businesses',
};

// titles from <title> for nice anchors
const titles = {};
for (const f of fs.readdirSync(BLOG).filter(x => x.endsWith('.html'))) {
  const slug = f.replace('.html', '');
  const m = fs.readFileSync(path.join(BLOG, f), 'utf8').match(/<title>([^<|]+)/);
  titles[slug] = m ? m[1].trim() : slug;
}
const label = (s) => s.startsWith('/') ? COMMERCIAL[s] : (titles[s] || s);
const href = (s) => s.startsWith('/') ? s : `/blog/${s}`;

// --- A) fix invisible related-article headings on existing posts ---
let fixedHeadings = 0;
for (const f of fs.readdirSync(BLOG).filter(x => x.endsWith('.html'))) {
  const fp = path.join(BLOG, f);
  let html = fs.readFileSync(fp, 'utf8');
  if (!html.includes('related-articles')) continue;
  const before = html;
  // the heading + box used color:#fff on a light page — make them readable
  html = html.replace(/(<div class="related-articles"[^>]*background:\s*)rgba\(255,255,255,0\.02\)/g, '$1rgba(74,222,128,0.06)');
  html = html.replace(/(<div class="related-articles"[^>]*border:\s*1px solid\s*)rgba\(255,255,255,0\.08\)/g, '$1rgba(74,222,128,0.18)');
  html = html.replace(/(<h3 style="font-size: 18px; font-weight: 700; color: )#fff/g, '$1#111');
  if (html !== before) { fs.writeFileSync(fp, html); fixedHeadings++; }
}

// --- B) related boxes for the 9 newest posts (2 blog + 1 commercial each) ---
const NEW_CLUSTERS = {
  'ai-agency-vs-in-house-vs-freelance': ['how-much-does-custom-ai-cost', 'how-to-choose-ai-vendor-guide', '/ai-automation-agency-singapore'],
  'ai-automation-cost-singapore-pricing-guide': ['how-much-does-custom-ai-cost', 'ai-roi-calculator-guide', '/ai-automation-agency-singapore'],
  'ai-claims-processing-singapore-insurance': ['what-is-intelligent-document-processing', 'ai-for-accounting-firms-singapore', '/ai-development-company-singapore'],
  'ai-freight-forwarding-quote-automation': ['what-is-ai-quote-automation', 'from-hours-to-minutes-quote-generation', '/ai-automation-agency-singapore'],
  'ai-pdpa-compliance-singapore': ['what-is-intelligent-document-processing', 'how-to-choose-ai-vendor-guide', '/ai-development-company-singapore'],
  'custom-ai-vs-off-the-shelf-solutions': ['custom-ai-vs-chatgpt-for-business', 'why-generic-ai-fails-complex-businesses', '/ai-development-company-singapore'],
  'edg-grant-ai-automation-singapore': ['how-much-does-custom-ai-cost', 'ai-automation-cost-singapore-pricing-guide', '/ai-automation-agency-singapore'],
  'rpa-vs-ai-automation-difference': ['custom-ai-vs-chatgpt-for-business', 'what-is-intelligent-document-processing', '/ai-automation-agency-singapore'],
  'what-is-agentic-ai-business-guide': ['ai-agents-for-business-singapore', 'ai-agent-vs-chatbot', '/ai-sales-agent-singapore'],
};
let relatedAdded = 0;
for (const [slug, rel] of Object.entries(NEW_CLUSTERS)) {
  const fp = path.join(BLOG, `${slug}.html`);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('related-articles')) continue;
  const links = rel.map(s => `        <li style="margin-bottom:10px;"><a href="${href(s)}" style="color:#22c55e;text-decoration:none;font-size:15px;font-weight:600;">${label(s)} &rarr;</a></li>`).join('\n');
  const box = `
    <div class="related-articles" style="margin:48px auto;max-width:760px;padding:28px 32px;background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.18);border-radius:16px;">
        <h3 style="font-size:18px;font-weight:700;color:#111;margin-bottom:16px;">Related Reading</h3>
        <ul style="list-style:none;padding:0;margin:0;">
${links}
        </ul>
    </div>
`;
  // insert before CTA section or footer
  const point = ['<section class="section cta-section">', '<section class="cta-section', '</article>', '<footer'].find(p => html.includes(p));
  if (point) { html = html.replace(point, box + '\n    ' + point); fs.writeFileSync(fp, html); relatedAdded++; }
}

// --- C) contextual commercial link into high-relevance posts ---
const COMMERCIAL_MAP = {
  'how-much-does-custom-ai-cost': '/ai-automation-agency-singapore',
  'ai-roi-calculator-guide': '/ai-automation-agency-singapore',
  'roi-of-ai-automation-real-numbers': '/ai-automation-agency-singapore',
  'what-is-ai-quote-automation': '/ai-automation-agency-singapore',
  'from-hours-to-minutes-quote-generation': '/ai-automation-agency-singapore',
  'ai-quoting-construction-singapore': '/ai-automation-agency-singapore',
  'ai-for-restaurants-singapore': '/ai-automation-agency-singapore',
  'ai-for-clinics-singapore': '/ai-automation-agency-singapore',
  'ai-scheduling-home-services-singapore': '/ai-automation-agency-singapore',
  'how-to-choose-ai-vendor-guide': '/ai-development-company-singapore',
  'custom-ai-vs-chatgpt-for-business': '/ai-development-company-singapore',
  'why-generic-ai-fails-complex-businesses': '/ai-development-company-singapore',
  'what-is-intelligent-document-processing': '/ai-development-company-singapore',
  'best-ai-companies-singapore': '/ai-development-company-singapore',
  'ai-for-accounting-firms-singapore': '/ai-development-company-singapore',
  'ai-for-law-firms-singapore': '/ai-development-company-singapore',
  'ai-agents-for-business-singapore': '/ai-sales-agent-singapore',
  'ai-agent-vs-chatbot': '/ai-sales-agent-singapore',
  'how-to-build-ai-agent-business': '/ai-sales-agent-singapore',
  'ai-for-real-estate-agents-singapore': '/ai-sales-agent-singapore',
};
const PITCH = {
  '/ai-automation-agency-singapore': 'Looking for an AI automation agency in Singapore?',
  '/ai-development-company-singapore': 'Want a custom AI system built for your business?',
  '/ai-sales-agent-singapore': 'Want an AI sales agent that answers customers 24/7?',
};
let commercialAdded = 0;
for (const [slug, url] of Object.entries(COMMERCIAL_MAP)) {
  const fp = path.join(BLOG, `${slug}.html`);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes(`href="${url}"`)) continue; // already links it
  const box = `
                <div class="commercial-link" style="background:#0a0a0a;border-radius:14px;padding:24px 28px;margin:32px 0;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;">
                    <span style="color:#fff;font-weight:600;font-size:1.02rem;">${PITCH[url]}</span>
                    <a href="${url}" style="background:#4ade80;color:#06281a;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:700;font-size:0.92rem;white-space:nowrap;">${COMMERCIAL[url]} &rarr;</a>
                </div>`;
  // insert after the first </h2> in the content (mid-article, contextual) or before related/cta
  const idx = html.indexOf('</h2>');
  if (idx !== -1) {
    html = html.slice(0, idx + 5) + box + html.slice(idx + 5);
  } else {
    const point = ['<section class="section cta-section">', '<footer'].find(p => html.includes(p));
    if (!point) continue;
    html = html.replace(point, box + '\n    ' + point);
  }
  fs.writeFileSync(fp, html);
  commercialAdded++;
}

console.log(`A) fixed ${fixedHeadings} invisible related headings`);
console.log(`B) added related boxes to ${relatedAdded} new posts`);
console.log(`C) added commercial links to ${commercialAdded} posts`);
