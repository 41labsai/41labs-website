// 41 Labs — event tracking (GA4: G-VQQ49H8N1L, GTM: GTM-WQJF7DK7)
// One delegated listener tracks every CTA on every page (current and future,
// including the runtime-injected floating WhatsApp button).
//
// Works with the site's DEFERRED analytics: GA only loads on first interaction
// or after 4s. We define a gtag stub up front so click events queue into
// dataLayer and are never dropped if a CTA click is the very first interaction.
(function () {
    'use strict';

    // Ensure gtag exists and queues into dataLayer even before gtag.js loads.
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
        window.gtag = function () { window.dataLayer.push(arguments); };
    }

    // Queue GA config at LOAD time so it always precedes click events. Before
    // this, a visitor whose very first interaction was a conversion click had
    // the event pushed to dataLayer ahead of the deferred loader's config, so
    // GA4 dropped it — which is why whatsapp_click barely registered. We send
    // no page_view here (the deferred loader still sends exactly one) and use
    // beacon transport so events survive the tab backgrounding when WhatsApp
    // opens. This queues only — it does NOT load gtag.js early (CWV preserved).
    var GA_MEASUREMENT_ID = 'G-VQQ49H8N1L';
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false, transport_type: 'beacon' });

    function track(name, params) {
        try { window.gtag('event', name, params || {}); } catch (e) {}
    }
    // Expose for inline page scripts (e.g. the audit flow) that want a safe tracker.
    window.track41 = track;

    function cleanText(el) {
        var t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
        return t.slice(0, 100);
    }

    // Name the CTA so "Chat with 41 Closer" is distinguishable from other buttons.
    function ctaId(el, href, text) {
        var hay = (text + ' ' + href).toLowerCase();
        if (/closer/.test(hay)) return '41_closer';
        if ((el.getAttribute('aria-label') || '').toLowerCase() === 'whatsapp us' || (el.closest && el.closest('[class*="float"]'))) return 'floating_whatsapp';
        if (el.classList.contains('nav-cta')) return 'nav_cta';
        if (el.classList.contains('hero-cta') || (el.closest && el.closest('.hero'))) return 'hero_cta';
        if (/audit/.test(hay)) return 'free_audit';
        if (/book|call|discovery|demo/.test(hay)) return 'book_call';
        if (/partner|affiliate/.test(hay)) return 'partner';
        return 'other';
    }

    document.addEventListener('click', function (e) {
        var el = e.target && e.target.closest ? e.target.closest('a, button') : null;
        if (!el) return;

        var href = el.getAttribute('href') || '';
        var text = cleanText(el);
        var page = location.pathname;

        // WhatsApp — the primary conversion across the site
        if (/wa\.me|whatsapp/i.test(href)) {
            track('whatsapp_click', {
                event_category: 'conversion',
                event_label: text || 'whatsapp',
                cta_id: ctaId(el, href, text),
                link_url: href,
                page_path: page
            });
            return;
        }

        // Email
        if (/^mailto:/i.test(href)) {
            track('email_click', { event_category: 'engagement', event_label: href.replace(/^mailto:/i, ''), page_path: page });
            return;
        }

        // Phone
        if (/^tel:/i.test(href)) {
            track('phone_click', { event_category: 'engagement', event_label: href.replace(/^tel:/i, ''), page_path: page });
            return;
        }

        // Generic CTA buttons (btn / cta classes), excluding pure UI toggles
        var cls = el.className || '';
        var isButton = typeof cls === 'string' && /\b(btn|cta)\b/.test(cls);
        var isUiToggle = el.classList.contains('mobile-menu-btn') || (el.closest && el.closest('.mobile-menu-btn'));
        if (isButton && !isUiToggle) {
            track('cta_click', {
                event_category: 'engagement',
                event_label: text || 'cta',
                cta_id: ctaId(el, href, text),
                link_url: href,
                page_path: page
            });
        }
    }, false);

    // Lead / contact form submissions
    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (!form || form.tagName !== 'FORM') return;
        track('form_submit', {
            event_category: 'conversion',
            event_label: form.id || form.getAttribute('name') || form.getAttribute('action') || 'form',
            page_path: location.pathname
        });
    }, true);
})();
