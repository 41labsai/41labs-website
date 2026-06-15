#!/usr/bin/env node
/**
 * enrich-comparisons.cjs — strengthen existing comparison/listicle posts for AI citation.
 * - best-ai-companies-singapore: add ItemList schema so engines parse the ranking.
 * - custom-ai-vs-off-the-shelf-solutions: add answer capsule + comparison table + FAQPage.
 * Idempotent.
 */
const fs = require('fs');
const path = require('path');
const BLOG = path.join(__dirname, 'blog');

function injectHeadSchema(file, obj, marker) {
  const fp = path.join(BLOG, file);
  if (!fs.existsSync(fp)) return console.log(`  skip (missing): ${file}`);
  let html = fs.readFileSync(fp, 'utf-8');
  if (html.includes(marker)) return console.log(`  skip (already): ${file}`);
  const block = `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>\n</head>`;
  html = html.replace('</head>', block);
  fs.writeFileSync(fp, html);
  console.log(`  + schema -> ${file}`);
}

// 1) ItemList for the listicle
injectHeadSchema('best-ai-companies-singapore.html', {
  '@context': 'https://schema.org', '@type': 'ItemList',
  name: 'Best AI Companies in Singapore (2026)',
  itemListOrder: 'https://schema.org/ItemListOrderDescending',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '41 Labs — Best for Custom AI Systems', url: 'https://41labs.ai/' },
    { '@type': 'ListItem', position: 2, name: 'Wiz.AI — Best for Voice AI' },
    { '@type': 'ListItem', position: 3, name: 'Tangentia — Best for Enterprise RPA' },
    { '@type': 'ListItem', position: 4, name: 'Brew Interactive — Best for Marketing AI' },
    { '@type': 'ListItem', position: 5, name: 'OTG Lab — Best for Basic Chatbots' },
    { '@type': 'ListItem', position: 6, name: 'Protiviti — Big 4 Consulting' },
  ],
}, '"@type": "ItemList"');

// 2) Enrich the thin custom-vs-off-the-shelf post
(function () {
  const fp = path.join(BLOG, 'custom-ai-vs-off-the-shelf-solutions.html');
  if (!fs.existsSync(fp)) return console.log('  skip (missing): custom-ai-vs-off-the-shelf');
  let html = fs.readFileSync(fp, 'utf-8');
  if (!html.includes('aeo-capsule')) {
    const capsuleAndTable = `
                <div class="aeo-capsule" style="background:rgba(74,222,128,0.07);border-left:3px solid #4ade80;border-radius:10px;padding:20px 24px;margin:0 0 28px;font-size:1.02rem;line-height:1.7;">
                    <strong>Off-the-shelf AI tools</strong> are cheaper to start (S$50–S$500/month) and fast to switch on, but one-size-fits-all. <strong>Custom AI</strong> (S$7,000–S$25,000) is trained on your own data and fits your exact process. Off-the-shelf wins for standard workflows; custom wins when your products, pricing, or documents are non-standard — which describes most real businesses.
                </div>
                <table>
                    <thead><tr><th>Factor</th><th>Off-the-Shelf AI Tools</th><th>Custom AI (41 Labs)</th></tr></thead>
                    <tbody>
                        <tr><td><strong>Cost</strong></td><td>S$50–S$500/month (forever)</td><td>S$7,000–S$25,000 (you own it)</td></tr>
                        <tr><td><strong>Setup</strong></td><td>Days</td><td>Prototype in ~2 weeks, deploy 3–8 weeks</td></tr>
                        <tr><td><strong>Fit to your process</strong></td><td>You adapt to the tool</td><td>Trained on your data and rules</td></tr>
                        <tr><td><strong>Handles non-standard work</strong></td><td>Breaks on edge cases</td><td>Designed for your complexity</td></tr>
                        <tr><td><strong>Ownership</strong></td><td>You rent access</td><td>You own the system</td></tr>
                        <tr><td><strong>Best for</strong></td><td>Simple, standard workflows</td><td>Complex, business-critical processes</td></tr>
                    </tbody>
                </table>`;
    html = html.replace(/(<div class="post-content">)/, `$1${capsuleAndTable}`);
  }
  if (!html.includes('"@type": "FAQPage"')) {
    const faq = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: [
        ['What is the difference between custom AI and off-the-shelf AI tools?', 'Off-the-shelf AI tools are pre-built products you configure within fixed limits. Custom AI is built around your specific workflows, data, and pricing rules. Tools are faster and cheaper to start; custom AI fits processes that are non-standard or business-critical, handling the messy real-world cases tools break on.'],
        ['Is custom AI worth the extra cost over off-the-shelf tools?', 'For standard, simple workflows, off-the-shelf tools are usually enough. For complex processes with your own pricing logic, documents, or data, custom AI typically pays back faster because it actually fits — one automated workflow often saves 15+ hours a week, recovering a S$7,000–S$25,000 project within 3–6 months. The EDG grant can offset up to 50%.'],
        ['When should I use off-the-shelf AI tools?', 'Use off-the-shelf tools when your workflow is standard, your budget is small, and speed matters more than fit — for example, a generic chatbot or a basic transcription tool. They are the right starting point for simple, common tasks.'],
        ['Can I start with off-the-shelf and move to custom later?', 'Yes. Many businesses start with an off-the-shelf tool to validate value, then move to a custom system once they hit its limits or need it to handle their specific data and rules. A good AI partner will tell you honestly when off-the-shelf is still enough.'],
      ].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    };
    html = html.replace('</head>', `    <script type="application/ld+json">\n${JSON.stringify(faq, null, 2)}\n    </script>\n</head>`);
  }
  fs.writeFileSync(fp, html);
  console.log('  + capsule + table + FAQPage -> custom-ai-vs-off-the-shelf-solutions.html');
})();

console.log('Enrichment done.');
