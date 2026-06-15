#!/usr/bin/env node
/**
 * inject-author-bio.cjs — add a visible "About the Author" E-E-A-T box to every blog post.
 * Author/expertise signals make pages materially more likely to be cited by AI engines and
 * help Google's E-E-A-T assessment. Idempotent (skips posts that already have the box).
 * Inserted right before the footer so it works across all post templates.
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const BLOG = path.join(ROOT, 'blog');

const BIO = `    <!-- E-E-A-T author box -->
    <section class="author-bio-section" style="border-top:1px solid rgba(0,0,0,0.08);">
      <div class="container" style="max-width:760px;padding:32px 24px;">
        <div class="author-bio" style="display:flex;gap:18px;align-items:flex-start;background:rgba(74,222,128,0.05);border:1px solid rgba(74,222,128,0.18);border-radius:14px;padding:24px;">
          <div class="author-avatar" style="flex:0 0 56px;width:56px;height:56px;border-radius:50%;background:#4ade80;color:#06281a;font-weight:800;font-size:1.3rem;display:flex;align-items:center;justify-content:center;">AL</div>
          <div>
            <div style="font-weight:700;font-size:1.02rem;">Alexander Lee <span style="color:#6b6b6b;font-weight:500;">· Founder, 41 Labs</span></div>
            <p style="margin:8px 0 10px;color:#555;font-size:0.93rem;line-height:1.6;">Alexander founded 41 Labs, a Singapore AI company that builds custom AI systems for SMEs and mid-market businesses. He works hands-on with companies across construction, healthcare, logistics, real estate, and professional services — finding the one process costing the most time and money, then building an AI system that fixes it. 41 Labs maintains a 100% production deployment rate.</p>
            <a href="https://www.linkedin.com/in/leejunweialexander/" target="_blank" rel="noopener" style="font-size:0.88rem;font-weight:600;color:#22c55e;">Connect on LinkedIn →</a>
          </div>
        </div>
      </div>
    </section>
`;

let done = 0, skip = 0;
for (const f of fs.readdirSync(BLOG).filter(x => x.endsWith('.html') && x !== 'index.html')) {
  const fp = path.join(BLOG, f);
  let html = fs.readFileSync(fp, 'utf-8');
  if (html.includes('author-bio-section')) { skip++; continue; }
  if (!html.includes('<footer')) { skip++; continue; }
  html = html.replace(/(\s*<footer)/, `\n${BIO}$1`);
  fs.writeFileSync(fp, html);
  done++;
}
console.log(`Author bio added to ${done} posts (${skip} skipped).`);
