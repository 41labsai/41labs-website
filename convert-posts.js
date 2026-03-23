#!/usr/bin/env node
/**
 * Converts markdown posts in /posts/ to static HTML in /blog/
 * with full SEO, GEO, schema markup — matching the existing template.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');
const INDEX_FILE = path.join(__dirname, 'posts-index.json');
const SITE_URL = 'https://41labs.ai';

// Load posts index for metadata
const postsIndex = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));

// Simple markdown to HTML converter
function md2html(md) {
  let html = md;

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Unordered lists
  html = html.replace(/^(\s*)[-*] (.+)$/gm, '$1<li>$2</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Paragraphs — wrap remaining text blocks
  const lines = html.split('\n');
  const result = [];
  let inParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      continue;
    }

    // Skip lines that are already HTML tags
    if (line.startsWith('<h') || line.startsWith('</h') ||
        line.startsWith('<ul') || line.startsWith('</ul') ||
        line.startsWith('<ol') || line.startsWith('</ol') ||
        line.startsWith('<li') || line.startsWith('<blockquote') ||
        line.startsWith('</blockquote') ||
        line.startsWith('<hr') || line.startsWith('<table') ||
        line.startsWith('</table') || line.startsWith('<tr') ||
        line.startsWith('</tr') || line.startsWith('<td') ||
        line.startsWith('<th') || line.startsWith('---')) {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      if (line === '---') {
        result.push('<hr>');
      } else {
        result.push(line);
      }
      continue;
    }

    if (!inParagraph) {
      result.push('<p>' + line);
      inParagraph = true;
    } else {
      result.push(' ' + line);
    }
  }

  if (inParagraph) result.push('</p>');

  return result.join('\n');
}

// Parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content };

  const metadata = {};
  let currentKey = null;
  let currentArray = null;

  match[1].split('\n').forEach(line => {
    if (line.startsWith('  - ')) {
      if (currentKey && currentArray) {
        currentArray.push(line.replace('  - ', '').trim().replace(/^["']|["']$/g, ''));
      }
    } else {
      if (currentKey && currentArray) {
        metadata[currentKey] = currentArray;
        currentArray = null;
      }
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        currentKey = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        if (!value) {
          currentArray = [];
        } else {
          value = value.replace(/^["']|["']$/g, '');
          metadata[currentKey] = value;
        }
      }
    }
  });
  if (currentKey && currentArray) metadata[currentKey] = currentArray;

  return { metadata, content: match[2] };
}

// Escape HTML entities for attributes
function escAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Format category for display
function formatCategory(cat) {
  const map = {
    'ai-systems': 'AI Systems',
    'automation': 'Automation',
    'case-studies': 'Case Studies',
    'insights': 'Insights'
  };
  return map[cat] || cat;
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return 'March 2026';
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Generate keywords from title and excerpt
function generateKeywords(meta) {
  const kw = meta.keywords;
  if (Array.isArray(kw) && kw.length > 0) return kw.join(', ');
  // Fallback: extract from title
  const words = (meta.title || '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, '').split(/\s+/)
    .filter(w => w.length > 3 && !['what','that','this','with','from','your','have','been','will','they','here','than','also','just'].includes(w));
  return [...new Set(words)].slice(0, 8).join(', ') + ', AI automation Singapore, 41 Labs';
}

// Generate article HTML
function generateArticleHtml(meta, bodyHtml) {
  const slug = meta.slug;
  const title = meta.title;
  const excerpt = meta.excerpt || '';
  const date = meta.date || '2026-02-01';
  const category = formatCategory(meta.category || 'insights');
  const readTime = meta.readTime || '5 min read';
  const author = meta.author || 'Alexander Lee';
  const keywords = generateKeywords(meta);
  const dateISO = date + 'T08:00:00+08:00';
  const url = `${SITE_URL}/blog/${slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VQQ49H8N1L"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-VQQ49H8N1L');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>${escHtml(title)} | 41 Labs</title>
    <meta name="description" content="${escAttr(excerpt)}">
    <meta name="keywords" content="${escAttr(keywords)}">
    <meta name="author" content="${escAttr(author)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="${url}">

    <!-- Geo Tags for Local SEO -->
    <meta name="geo.region" content="SG">
    <meta name="geo.placename" content="Singapore">
    <meta name="geo.position" content="1.3521;103.8198">
    <meta name="ICBM" content="1.3521, 103.8198">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escAttr(title)} | 41 Labs">
    <meta property="og:description" content="${escAttr(excerpt)}">
    <meta property="og:image" content="${SITE_URL}/og-image.jpg">
    <meta property="og:site_name" content="41 Labs">
    <meta property="article:published_time" content="${dateISO}">
    <meta property="article:modified_time" content="${dateISO}">
    <meta property="article:author" content="https://www.linkedin.com/in/leejunweialexander/">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${escAttr(title)} | 41 Labs">
    <meta name="twitter:description" content="${escAttr(excerpt)}">
    <meta name="twitter:image" content="${SITE_URL}/og-image.jpg">

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="../logo-icon.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../logo-icon.png">
    <link rel="apple-touch-icon" href="../logo-icon.png">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="41 Labs Blog" href="${SITE_URL}/feed.xml">

    <!-- Article Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": ${JSON.stringify(title)},
        "description": ${JSON.stringify(excerpt)},
        "image": "${SITE_URL}/og-image.jpg",
        "author": {
            "@type": "Person",
            "name": ${JSON.stringify(author)},
            "jobTitle": "Founder & CEO",
            "url": "https://www.linkedin.com/in/leejunweialexander/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "41 Labs",
            "logo": {
                "@type": "ImageObject",
                "url": "${SITE_URL}/logo-full.png"
            }
        },
        "datePublished": "${dateISO}",
        "dateModified": "${dateISO}",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${url}"
        }
    }
    </script>

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "${SITE_URL}/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "${SITE_URL}/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": ${JSON.stringify(title)}
            }
        ]
    }
    </script>

    <link rel="stylesheet" href="../styles.css?v=4">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WQJF7DK7');</script>
<!-- End Google Tag Manager -->
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WQJF7DK7"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo">
                <img src="../logo-nav.png?v=2" alt="41 Labs" class="logo-img" style="height: 60px;">
            </a>
            <ul class="nav-links">
                <li><a href="../index.html#what-we-do">What We Do</a></li>
                <li class="nav-dropdown-wrap">
                    <a href="#" class="nav-dropdown-trigger">Industries <span style="font-size:0.65em;opacity:0.7;">&#9662;</span></a>
                    <div class="nav-dropdown">
                        <a href="../industries/construction">Construction</a>
                        <a href="../industries/healthcare">Healthcare &amp; Clinics</a>
                        <a href="../industries/home-services">Home Services</a>
                        <a href="../industries/professional-services">Professional Services</a>
                        <a href="../industries/automotive">Automotive &amp; Tow Truck</a>
                        <a href="../industries/fnb">F&amp;B &amp; Restaurants</a>
                        <a href="../industries/beauty-wellness">Beauty &amp; Wellness</a>
                    </div>
                </li>
                <li><a href="../case-studies.html">Case Studies</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="../index.html#faq">FAQ</a></li>
            </ul>
            <a href="https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F" target="_blank" rel="noopener" class="btn btn-primary nav-cta">WhatsApp Us</a>
            <button class="mobile-menu-btn" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <!-- Article -->
    <article class="post-article">
        <div class="container">
            <!-- Breadcrumb -->
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <ol itemscope itemtype="https://schema.org/BreadcrumbList">
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <a itemprop="item" href="../index.html"><span itemprop="name">Home</span></a>
                        <meta itemprop="position" content="1">
                    </li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <a itemprop="item" href="../blog.html"><span itemprop="name">Blog</span></a>
                        <meta itemprop="position" content="2">
                    </li>
                    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                        <span itemprop="name">${escHtml(title)}</span>
                        <meta itemprop="position" content="3">
                    </li>
                </ol>
            </nav>

            <!-- Post Header -->
            <header class="post-header">
                <div class="post-meta">
                    <span class="post-category">${escHtml(category)}</span>
                    <span class="post-date">${formatDate(date)}</span>
                    <span class="post-read-time">${escHtml(readTime)}</span>
                </div>
                <h1>${escHtml(title)}</h1>
                <p class="post-excerpt">${escHtml(excerpt)}</p>
                <div class="post-author">
                    <span>By <strong><a href="https://www.linkedin.com/in/leejunweialexander/" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">${escHtml(author)}</a></strong>, Founder, 41 Labs</span>
                </div>
            </header>

            <!-- Post Content -->
            <div class="post-content">
                ${bodyHtml}

                <h2>Ready to Explore AI for Your Business?</h2>

                <p>Every business has operations that could run faster, cheaper, and more accurately with AI. The question is which ones — and whether the ROI justifies the investment. <strong>Book a free strategy call with 41 Labs.</strong> We will audit your current workflows and show you exactly where AI delivers the highest impact.</p>

                <p style="margin-top: 32px;">
                    <a href="https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F" class="btn btn-primary btn-large" target="_blank" rel="noopener">Book Your Free Strategy Call</a>
                </p>
            </div>

            <!-- Share Buttons -->
            <div class="post-share">
                <span>Share this article:</span>
                <div class="share-buttons">
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener" aria-label="Share on Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <button onclick="navigator.clipboard.writeText('${url}')" aria-label="Copy link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    </article>

    <!-- CTA Section -->
    <section class="section cta-section">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to implement AI in your business?</h2>
                <p>Book a discovery call. We'll show you exactly where AI can drive impact.</p>
                <a href="https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F" class="btn btn-primary btn-large" target="_blank" rel="noopener">Book Your Discovery Call</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <img src="../logo-full.png" alt="41 Labs" class="footer-logo">
                    <p>Custom AI systems for revenue and operations.</p>
                    <div class="footer-contact">
                        <a href="mailto:alexander@41labs.ai">alexander@41labs.ai</a>
                        <span>Singapore</span>
                    </div>
                </div>
                <div class="footer-links">
                    <a href="../index.html#what-we-do">What We Do</a>
                    <a href="https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F" target="_blank" rel="noopener">WhatsApp Us</a>
                    <a href="../case-studies.html">Case Studies</a>
                    <a href="../about.html">About</a>
                    <a href="../privacy.html">Privacy</a>
                </div>
                <div class="footer-industries">
                    <strong>Industries</strong>
                    <a href="../industries/construction">Construction</a>
                    <a href="../industries/healthcare">Healthcare</a>
                    <a href="../industries/home-services">Home Services</a>
                    <a href="../industries/professional-services">Professional Services</a>
                    <a href="../industries/automotive">Automotive</a>
                    <a href="../industries/fnb">F&amp;B</a>
                    <a href="../industries/beauty-wellness">Beauty &amp; Wellness</a>
                </div>
                <div class="footer-social">
                    <a href="https://www.linkedin.com/company/fortyonelabs" target="_blank" rel="noopener" aria-label="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 41 Labs. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../script.js"></script>
</body>
</html>`;
}

// ---- MAIN ----
if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR);

const mdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const converted = [];
const skipped = [];

for (const file of mdFiles) {
  const slug = file.replace('.md', '');
  const outFile = path.join(BLOG_DIR, slug + '.html');

  // Skip if static HTML already exists (hand-crafted posts)
  if (fs.existsSync(outFile)) {
    skipped.push(slug);
    continue;
  }

  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { metadata, content } = parseFrontmatter(raw);

  // Merge with index metadata
  const indexMeta = postsIndex.posts.find(p => p.slug === slug) || {};
  const meta = { ...indexMeta, ...metadata, slug };

  const bodyHtml = md2html(content);
  const pageHtml = generateArticleHtml(meta, bodyHtml);

  fs.writeFileSync(outFile, pageHtml);
  converted.push(slug);
}

console.log(`Converted ${converted.length} posts:`);
converted.forEach(s => console.log(`  + blog/${s}.html`));
if (skipped.length) {
  console.log(`Skipped ${skipped.length} (already exist):`);
  skipped.forEach(s => console.log(`  - ${s}`));
}

// ---- Generate blog listing cards ----
// Collect ALL posts (existing static + newly converted)
const allBlogFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
const allPosts = [];

for (const file of allBlogFiles) {
  const slug = file.replace('.html', '');
  const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');

  // Extract metadata from HTML
  const titleMatch = html.match(/<title>([^|<]+)/);
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const dateMatch = html.match(/article:published_time" content="(\d{4}-\d{2}-\d{2})/);
  const catMatch = html.match(/<span class="post-category">([^<]+)<\/span>/);
  const readMatch = html.match(/<span class="post-read-time">([^<]+)<\/span>/);

  // Also check index for category slug
  const indexEntry = postsIndex.posts.find(p => p.slug === slug);

  allPosts.push({
    slug,
    title: titleMatch ? titleMatch[1].trim() : slug,
    excerpt: descMatch ? descMatch[1] : '',
    date: dateMatch ? dateMatch[1] : '2026-02-01',
    category: indexEntry ? indexEntry.category : (catMatch ? catMatch[1].toLowerCase().replace(/\s+/g, '-') : 'insights'),
    categoryDisplay: catMatch ? catMatch[1] : 'Insights',
    readTime: readMatch ? readMatch[1] : '5 min read'
  });
}

// Sort newest first
allPosts.sort((a, b) => b.date.localeCompare(a.date));

// Generate blog.html cards
const cardsHtml = allPosts.map(p => {
  const excerptEsc = escHtml(p.excerpt.length > 200 ? p.excerpt.slice(0, 197) + '...' : p.excerpt);
  return `                <article class="post-card" data-category="${escAttr(p.category)}">
                    <a href="blog/${p.slug}" class="post-card-link-wrap">
                        <div class="post-card-content">
                            <div class="post-card-meta">
                                <span class="post-category">${escHtml(p.categoryDisplay)}</span>
                                <span class="post-date">${formatDate(p.date)}</span>
                            </div>
                            <h3>${escHtml(p.title)}</h3>
                            <p>${excerptEsc}</p>
                            <span class="read-more">Read more &rarr;</span>
                        </div>
                    </a>
                </article>`;
}).join('\n');

// Update blog.html
let blogHtml = fs.readFileSync(path.join(__dirname, 'blog.html'), 'utf8');
const gridStart = blogHtml.indexOf('<div class="posts-grid" id="posts-grid">');
const gridEnd = blogHtml.indexOf('</div>', blogHtml.indexOf('</article>', gridStart) + 10);

if (gridStart > -1 && gridEnd > -1) {
  // Find the actual closing </div> of posts-grid
  let depth = 0;
  let idx = gridStart;
  let closeIdx = -1;
  while (idx < blogHtml.length) {
    if (blogHtml.slice(idx).startsWith('<div')) { depth++; idx += 4; }
    else if (blogHtml.slice(idx).startsWith('</div>')) {
      depth--;
      if (depth === 0) { closeIdx = idx + 6; break; }
      idx += 6;
    } else { idx++; }
  }

  if (closeIdx > -1) {
    blogHtml = blogHtml.slice(0, gridStart) +
      `<div class="posts-grid" id="posts-grid">\n${cardsHtml}\n            </div>` +
      blogHtml.slice(closeIdx);
    fs.writeFileSync(path.join(__dirname, 'blog.html'), blogHtml);
    console.log(`\nBlog listing updated with ${allPosts.length} articles.`);
  }
}

// Update sitemap
const sitemapPath = path.join(__dirname, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const today = new Date().toISOString().split('T')[0];

  for (const p of allPosts) {
    const urlEntry = `<url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    if (!sitemap.includes(`/blog/${p.slug}`)) {
      sitemap = sitemap.replace('</urlset>', `  ${urlEntry}\n</urlset>`);
    }
  }
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('Sitemap updated with blog URLs.');
}
