// Blog System JavaScript
// Reads from Markdown files in /posts/ directory

const SITE_URL = 'https://41labs.ai';

let postsData = [];

// Load posts index for listing page
async function loadPostsIndex() {
    try {
        const response = await fetch('posts-index.json');
        if (response.ok) {
            const data = await response.json();
            if (data.posts && data.posts.length > 0) {
                postsData = data.posts;
            }
        }
    } catch (e) {
        console.error('Error loading posts index:', e);
    }
}

// Parse frontmatter from Markdown file
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { metadata: {}, content: content };

    const frontmatter = match[1];
    const markdown = match[2];

    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // Remove quotes
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            metadata[key] = value;
        }
    });

    return { metadata, content: markdown };
}

// Load individual markdown post
async function loadMarkdownPost(slug) {
    try {
        const response = await fetch(`posts/${slug}.md`);
        if (response.ok) {
            const text = await response.text();
            const { metadata, content } = parseFrontmatter(text);

            // Convert markdown to HTML using marked.js
            const htmlContent = marked.parse(content);

            return {
                ...metadata,
                slug: slug,
                content: htmlContent
            };
        }
    } catch (e) {
        console.error('Error loading post:', e);
    }
    return null;
}

// Filter static post cards by category
function filterStaticPosts(category) {
    const cards = document.querySelectorAll('#posts-grid .post-card');
    let visible = 0;
    cards.forEach(card => {
        const cardCategory = card.dataset.category || '';
        if (category === 'all' || cardCategory === category) {
            card.style.display = '';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });
    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
}

// Load individual post page
async function loadPost(slug) {
    // First get metadata from index
    const postMeta = postsData.find(p => p.slug === slug);

    if (!postMeta) {
        window.location.href = 'blog.html';
        return;
    }

    // Load full markdown content
    const post = await loadMarkdownPost(slug);

    if (!post) {
        window.location.href = 'blog.html';
        return;
    }

    // Merge metadata
    const fullPost = { ...postMeta, ...post };

    // Update page content
    document.getElementById('post-title').textContent = fullPost.title;
    document.getElementById('post-excerpt').textContent = fullPost.excerpt;
    document.getElementById('post-category').textContent = formatCategory(fullPost.category);
    document.getElementById('post-date').textContent = formatDate(fullPost.date);
    document.getElementById('post-read-time').textContent = fullPost.readTime;
    document.getElementById('post-author').textContent = fullPost.author;
    document.getElementById('post-content').innerHTML = fullPost.content;
    document.getElementById('breadcrumb-title').textContent = fullPost.title;

    // Handle featured image
    const imageContainer = document.getElementById('post-image-container');
    if (fullPost.image) {
        document.getElementById('post-image').src = fullPost.image;
        document.getElementById('post-image').alt = fullPost.title;
    } else {
        imageContainer.style.display = 'none';
    }

    // Update SEO meta tags
    const pageUrl = `${SITE_URL}/post.html?slug=${slug}`;
    document.getElementById('page-title').textContent = `${fullPost.title} | 41 Labs Blog`;
    document.getElementById('meta-description').content = fullPost.excerpt;
    document.getElementById('canonical-url').href = pageUrl;

    // Open Graph
    document.getElementById('og-url').content = pageUrl;
    document.getElementById('og-title').content = fullPost.title;
    document.getElementById('og-description').content = fullPost.excerpt;
    document.getElementById('og-image').content = fullPost.image || `${SITE_URL}/og-image.jpg`;
    document.getElementById('og-published').content = fullPost.date;

    // Twitter
    document.getElementById('twitter-url').content = pageUrl;
    document.getElementById('twitter-title').content = fullPost.title;
    document.getElementById('twitter-description').content = fullPost.excerpt;
    document.getElementById('twitter-image').content = fullPost.image || `${SITE_URL}/og-image.jpg`;

    // Structured Data
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": fullPost.title,
        "description": fullPost.excerpt,
        "image": fullPost.image || `${SITE_URL}/og-image.jpg`,
        "author": {
            "@type": "Person",
            "name": fullPost.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "41 Labs",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/logo-full.png`
            }
        },
        "datePublished": fullPost.date,
        "dateModified": fullPost.date,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": pageUrl
        }
    };
    document.getElementById('article-schema').textContent = JSON.stringify(schema);

    // Share buttons
    const shareTitle = encodeURIComponent(fullPost.title);
    const shareUrl = encodeURIComponent(pageUrl);

    document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;

    document.getElementById('share-copy').addEventListener('click', () => {
        navigator.clipboard.writeText(pageUrl).then(() => {
            alert('Link copied to clipboard!');
        });
    });

    // Load related posts
    loadRelatedPosts(fullPost);
}

// Load related posts
function loadRelatedPosts(currentPost) {
    const relatedContainer = document.getElementById('related-posts');
    if (!relatedContainer) return;

    const related = postsData
        .filter(p => p.slug !== currentPost.slug)
        .filter(p => p.category === currentPost.category)
        .slice(0, 3);

    if (related.length === 0) {
        relatedContainer.parentElement.style.display = 'none';
        return;
    }

    relatedContainer.innerHTML = related.map(post => `
        <a href="post.html#${post.slug}" class="related-post-card">
            <span class="related-post-category">${formatCategory(post.category)}</span>
            <h3>${post.title}</h3>
            <span class="related-post-read-time">${post.readTime}</span>
        </a>
    `).join('');
}

// Filter posts by category
function filterPosts(category) {
    const filtered = category === 'all'
        ? postsData
        : postsData.filter(p => p.category === category);

    renderPosts(filtered, document.getElementById('posts-grid'));
}

// Format category for display
function formatCategory(category) {
    const categories = {
        'ai-systems': 'AI Systems',
        'automation': 'Automation',
        'case-studies': 'Case Studies',
        'insights': 'Insights'
    };
    return categories[category] || category;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize blog page
document.addEventListener('DOMContentLoaded', async function() {
    const postsGrid = document.getElementById('posts-grid');
    if (postsGrid) {
        // Filter buttons work on static HTML cards
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterStaticPosts(this.dataset.category);
            });
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert('Thanks for subscribing! (Connect this to your email service)');
            this.reset();
        });
    }
});
