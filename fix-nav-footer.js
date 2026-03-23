#!/usr/bin/env node
/**
 * Standardizes nav and footer across ALL pages on 41labs.ai
 * Handles path differences for root vs subdirectory pages.
 */

const fs = require('fs');
const path = require('path');
// Canonical nav HTML (uses prefix for paths)
function getNav(prefix) {
  return `    <!-- Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="${prefix}index.html" class="logo">
                <img src="${prefix}logo-nav.png?v=2" alt="41 Labs" class="logo-img" style="height: 60px;">
            </a>
            <ul class="nav-links">
                <li><a href="${prefix}index.html#what-we-do">What We Do</a></li>
                <li class="nav-dropdown-wrap">
                    <a href="#" class="nav-dropdown-trigger">Industries <span style="font-size:0.65em;opacity:0.7;">&#9662;</span></a>
                    <div class="nav-dropdown">
                        <a href="/industries/construction">Construction</a>
                        <a href="/industries/healthcare">Healthcare &amp; Clinics</a>
                        <a href="/industries/home-services">Home Services</a>
                        <a href="/industries/professional-services">Professional Services</a>
                        <a href="/industries/automotive">Automotive &amp; Tow Truck</a>
                        <a href="/industries/fnb">F&amp;B &amp; Restaurants</a>
                        <a href="/industries/beauty-wellness">Beauty &amp; Wellness</a>
                    </div>
                </li>
                <li><a href="${prefix}case-studies.html">Case Studies</a></li>
                <li><a href="${prefix}about.html">About</a></li>
                <li><a href="${prefix}blog.html">Blog</a></li>
                <li><a href="${prefix}index.html#faq">FAQ</a></li>
            </ul>
            <a href="https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F" target="_blank" rel="noopener" class="btn btn-primary nav-cta">WhatsApp Us</a>
            <button class="mobile-menu-btn" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>`;
}

function getFooter(prefix) {
  return `    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <img src="${prefix}logo-full.png" alt="41 Labs" class="footer-logo">
                    <p>Custom AI systems for revenue and operations.</p>
                    <div class="footer-contact">
                        <a href="mailto:alexander@41labs.ai">alexander@41labs.ai</a>
                        <span>Singapore</span>
                    </div>
                </div>
                <div class="footer-links">
                    <a href="${prefix}index.html#what-we-do">What We Do</a>
                    <a href="https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F" target="_blank" rel="noopener">WhatsApp Us</a>
                    <a href="${prefix}case-studies.html">Case Studies</a>
                    <a href="${prefix}about.html">About</a>
                    <a href="${prefix}blog.html">Blog</a>
                    <a href="${prefix}privacy.html">Privacy</a>
                </div>
                <div class="footer-industries">
                    <strong>Industries</strong>
                    <a href="/industries/construction">Construction</a>
                    <a href="/industries/healthcare">Healthcare</a>
                    <a href="/industries/home-services">Home Services</a>
                    <a href="/industries/professional-services">Professional Services</a>
                    <a href="/industries/automotive">Automotive</a>
                    <a href="/industries/fnb">F&amp;B</a>
                    <a href="/industries/beauty-wellness">Beauty &amp; Wellness</a>
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
    </footer>`;
}

// Find all HTML files
function findHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'ads' || entry.name === 'admin') continue;
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html') && !['404.html', 'dashboard.html', 'brandbook.html', 'audit.html', 'post.html'].includes(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const ROOT = __dirname;
const allFiles = findHtmlFiles(ROOT);

let updated = 0;
let skipped = 0;

for (const filePath of allFiles) {
  let html = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);

  // Determine prefix based on depth
  const depth = relPath.split(path.sep).length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  // Check if it has a nav
  const navStart = html.indexOf('<nav class="navbar">');
  const navEnd = html.indexOf('</nav>');

  // Check if it has a footer
  const footerStart = html.indexOf('<footer class="footer">');
  const footerEnd = html.lastIndexOf('</footer>');

  if (navStart === -1 && footerStart === -1) {
    skipped++;
    continue;
  }

  let changed = false;

  // Replace nav
  if (navStart > -1 && navEnd > -1) {
    // Find the comment before nav if present
    let actualStart = navStart;
    const beforeNav = html.slice(Math.max(0, navStart - 100), navStart);
    const commentMatch = beforeNav.match(/<!--\s*Navigation\s*-->\s*$/);
    if (commentMatch) {
      actualStart = navStart - commentMatch[0].length;
    }

    const newNav = getNav(prefix);
    const oldNav = html.slice(actualStart, navEnd + '</nav>'.length);
    if (oldNav !== newNav) {
      html = html.slice(0, actualStart) + newNav + html.slice(navEnd + '</nav>'.length);
      changed = true;
    }
  }

  // Replace footer (re-find positions after nav replacement)
  const newFooterStart = html.indexOf('<footer class="footer">');
  const newFooterEnd = html.lastIndexOf('</footer>');

  if (newFooterStart > -1 && newFooterEnd > -1) {
    let actualFooterStart = newFooterStart;
    const beforeFooter = html.slice(Math.max(0, newFooterStart - 100), newFooterStart);
    const footerComment = beforeFooter.match(/<!--\s*Footer\s*-->\s*$/);
    if (footerComment) {
      actualFooterStart = newFooterStart - footerComment[0].length;
    }

    const newFooter = getFooter(prefix);
    const oldFooter = html.slice(actualFooterStart, newFooterEnd + '</footer>'.length);
    if (oldFooter !== newFooter) {
      html = html.slice(0, actualFooterStart) + newFooter + html.slice(newFooterEnd + '</footer>'.length);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    updated++;
    console.log(`  ✓ ${relPath}`);
  } else {
    skipped++;
  }
}

console.log(`\nDone: ${updated} files updated, ${skipped} skipped.`);
