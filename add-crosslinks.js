const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');

// Define related article clusters
const clusters = {
  'ai-agents-for-business-singapore': ['ai-agent-vs-chatbot', 'how-to-build-ai-agent-business', 'ai-for-small-business-guide'],
  'ai-agent-vs-chatbot': ['ai-agents-for-business-singapore', 'how-to-build-ai-agent-business', 'custom-ai-vs-chatgpt-for-business'],
  'how-to-build-ai-agent-business': ['ai-agents-for-business-singapore', 'ai-agent-vs-chatbot', 'ai-implementation-timeline'],
  'ai-for-restaurants-singapore': ['ai-for-clinics-singapore', 'ai-for-salons-beauty-singapore', 'ai-agents-for-business-singapore'],
  'ai-for-clinics-singapore': ['ai-for-restaurants-singapore', 'ai-for-salons-beauty-singapore', 'ai-for-accounting-firms-singapore'],
  'ai-for-law-firms-singapore': ['ai-for-accounting-firms-singapore', 'what-is-intelligent-document-processing', 'how-much-does-custom-ai-cost'],
  'ai-for-accounting-firms-singapore': ['ai-for-law-firms-singapore', 'ai-roi-calculator-guide', 'what-is-intelligent-document-processing'],
  'ai-for-salons-beauty-singapore': ['ai-for-restaurants-singapore', 'ai-for-clinics-singapore', 'ai-scheduling-home-services-singapore'],
  'ai-for-real-estate-agents-singapore': ['ai-agents-for-business-singapore', 'ai-for-small-business-guide', 'how-much-does-custom-ai-cost'],
  'ai-quoting-construction-singapore': ['from-hours-to-minutes-quote-generation', 'what-is-ai-quote-automation', 'ai-roi-calculator-guide'],
  'from-hours-to-minutes-quote-generation': ['ai-quoting-construction-singapore', 'what-is-ai-quote-automation', 'roi-of-ai-automation-real-numbers'],
  'what-is-ai-quote-automation': ['ai-quoting-construction-singapore', 'from-hours-to-minutes-quote-generation', 'how-much-does-custom-ai-cost'],
  'ai-dispatch-tow-truck': ['ai-scheduling-home-services-singapore', 'ai-agents-for-business-singapore', 'roi-of-ai-automation-real-numbers'],
  'ai-scheduling-home-services-singapore': ['ai-dispatch-tow-truck', 'ai-for-salons-beauty-singapore', 'ai-agents-for-business-singapore'],
  'how-much-does-custom-ai-cost': ['ai-roi-calculator-guide', 'when-should-business-invest-in-ai', 'how-to-choose-ai-vendor-guide'],
  'ai-roi-calculator-guide': ['how-much-does-custom-ai-cost', 'roi-of-ai-automation-real-numbers', 'when-should-business-invest-in-ai'],
  'roi-of-ai-automation-real-numbers': ['ai-roi-calculator-guide', 'how-much-does-custom-ai-cost', 'from-hours-to-minutes-quote-generation'],
  'when-should-business-invest-in-ai': ['is-your-business-ai-ready', '5-signs-business-needs-ai-automation', 'ai-readiness-checklist-for-operations'],
  'is-your-business-ai-ready': ['when-should-business-invest-in-ai', 'ai-readiness-checklist-for-operations', '5-signs-business-needs-ai-automation'],
  'ai-readiness-checklist-for-operations': ['is-your-business-ai-ready', 'when-should-business-invest-in-ai', 'ai-for-small-business-guide'],
  'custom-ai-vs-chatgpt-for-business': ['why-generic-ai-fails-complex-businesses', 'ai-agent-vs-chatbot', 'how-to-choose-ai-vendor-guide'],
  'why-generic-ai-fails-complex-businesses': ['custom-ai-vs-chatgpt-for-business', 'how-to-choose-ai-vendor-guide', 'ai-agents-for-business-singapore'],
  'how-to-choose-ai-vendor-guide': ['how-much-does-custom-ai-cost', 'custom-ai-vs-chatgpt-for-business', 'why-generic-ai-fails-complex-businesses'],
  'ai-for-small-business-guide': ['how-much-does-custom-ai-cost', '5-signs-business-needs-ai-automation', 'when-should-business-invest-in-ai'],
  'ai-automation-southeast-asia-2026-trends': ['ai-for-small-business-guide', 'ai-agents-for-business-singapore', 'roi-of-ai-automation-real-numbers'],
  'ai-implementation-timeline': ['how-much-does-custom-ai-cost', 'how-to-choose-ai-vendor-guide', 'ai-readiness-checklist-for-operations'],
  'what-is-intelligent-document-processing': ['ai-for-law-firms-singapore', 'ai-for-accounting-firms-singapore', 'ai-agents-for-business-singapore'],
  '5-signs-business-needs-ai-automation': ['when-should-business-invest-in-ai', 'is-your-business-ai-ready', 'ai-for-small-business-guide']
};

// Get titles from files
const titles = {};
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
for (const file of files) {
  const slug = file.replace('.html', '');
  const html = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const m = html.match(/<title>([^<]+)<\/title>/);
  titles[slug] = m ? m[1].replace(' | 41 Labs', '').trim() : slug;
}

let updated = 0;
for (const file of files) {
  const slug = file.replace('.html', '');
  const related = clusters[slug];
  if (!related) continue;

  const filePath = path.join(blogDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already has related articles
  if (html.includes('related-articles')) continue;

  const links = related.map(s => 
    `        <li><a href="/blog/${s}" style="color: #4ade80; text-decoration: none; font-size: 15px; font-weight: 500; transition: opacity 0.2s;">${titles[s] || s} →</a></li>`
  ).join('\n');

  const relatedHtml = `
    <div class="related-articles" style="margin: 48px 0; padding: 32px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">Related Articles</h3>
        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;">
${links}
        </ul>
    </div>`;

  // Insert before the CTA section or share section or footer
  const insertPoints = [
    '<!-- CTA Section -->',
    '<div class="share-section',
    '<section class="cta-section',
    '<div class="cta-block',
    '<!-- Share -->',
    '</article>',
    '</main>'
  ];

  let inserted = false;
  for (const point of insertPoints) {
    const idx = html.indexOf(point);
    if (idx !== -1) {
      html = html.slice(0, idx) + relatedHtml + '\n\n    ' + html.slice(idx);
      inserted = true;
      break;
    }
  }

  if (inserted) {
    fs.writeFileSync(filePath, html);
    updated++;
  }
}

console.log(`Cross-links added to ${updated} articles`);
