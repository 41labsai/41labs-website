// 41 Labs Landing Page JavaScript
// Premium animations and interactions

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // COUNTING NUMBER ANIMATIONS
    // ===================================

    function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
        let start = 0;
        const increment = target / (duration / 16);
        const isDecimal = target % 1 !== 0;

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = prefix + (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = prefix + target + suffix;
            }
        }
        updateCounter();
    }

    // Observer for counting animations - resets each time section scrolls into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const target = entry.target.dataset.target;
            const suffix = entry.target.dataset.suffix || '';
            const prefix = entry.target.dataset.prefix || '';

            if (entry.isIntersecting) {
                if (target) {
                    animateCounter(entry.target, parseFloat(target), 2000, prefix, suffix);
                }
            } else {
                // Reset when scrolled out of view
                if (target) {
                    entry.target.textContent = prefix + '0' + suffix;
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe all counter elements
    document.querySelectorAll('[data-target]').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ===================================
    // HERO DASHBOARD ANIMATION
    // ===================================

    function animateHeroDashboard() {
        const quotesEl = document.getElementById('hero-quotes');
        const timeEl = document.getElementById('hero-time');
        const docsEl = document.getElementById('hero-docs');
        if (!quotesEl) return;

        const bars = document.querySelectorAll('.metric-bar-fill');
        let quoteCount = 0;
        const quoteTarget = 247;
        const docTarget = 1832;
        let docCount = 0;

        // Animate quotes counter
        function tickQuotes() {
            if (quoteCount < quoteTarget) {
                quoteCount += Math.ceil((quoteTarget - quoteCount) / 20);
                quotesEl.textContent = quoteCount.toLocaleString();
                requestAnimationFrame(tickQuotes);
            } else {
                quotesEl.textContent = quoteTarget.toLocaleString();
            }
        }

        // Animate docs counter
        function tickDocs() {
            if (docCount < docTarget) {
                docCount += Math.ceil((docTarget - docCount) / 20);
                docsEl.textContent = docCount.toLocaleString();
                requestAnimationFrame(tickDocs);
            } else {
                docsEl.textContent = docTarget.toLocaleString();
            }
        }

        // Animate processing time
        const times = ['1.2s', '0.8s', '1.5s', '0.9s', '1.1s'];
        let timeIdx = 0;
        function tickTime() {
            timeEl.textContent = times[timeIdx % times.length];
            timeIdx++;
        }

        // Start animations with stagger
        setTimeout(tickQuotes, 300);
        setTimeout(() => { tickTime(); setInterval(tickTime, 3000); }, 600);
        setTimeout(tickDocs, 900);

        // Animate bars
        setTimeout(() => { if (bars[0]) bars[0].style.width = '78%'; }, 500);
        setTimeout(() => { if (bars[1]) bars[1].style.width = '92%'; }, 800);
    }

    animateHeroDashboard();

    // ===================================
    // STAGGERED REVEAL ANIMATIONS
    // ===================================

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Stagger children animations
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('revealed');
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // ===================================
    // FLOATING ANIMATION FOR VISUALS
    // ===================================

    function initFloatingElements() {
        document.querySelectorAll('.float-element').forEach((el, index) => {
            el.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
            el.style.animationDelay = `${index * 0.3}s`;
        });
    }
    initFloatingElements();

    // ===================================
    // PROGRESS BAR ANIMATIONS
    // ===================================

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const progress = entry.target.dataset.progress || 100;
                entry.target.querySelector('.progress-fill').style.width = progress + '%';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-bar').forEach(bar => {
        progressObserver.observe(bar);
    });

    // ===================================
    // MAGNETIC BUTTON EFFECT
    // ===================================

    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ===================================
    // PARALLAX ON SCROLL
    // ===================================

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;

        document.querySelectorAll('.parallax-slow').forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.05}px)`;
        });

        document.querySelectorAll('.parallax-medium').forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.1}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // ===================================
    // TYPING EFFECT FOR HEADLINES
    // ===================================

    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // ===================================
    // SMOOTH SECTION REVEALS
    // ===================================

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        sectionObserver.observe(section);
    });

    // Make hero visible immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }

    // Make testimonials visible (moved up near hero)
    const testimonials = document.querySelector('.testimonials-section');
    if (testimonials) {
        testimonials.style.opacity = '1';
        testimonials.style.transform = 'translateY(0)';
    }

    const problemSection = document.querySelector('.problem-section');
    if (problemSection) {
        problemSection.style.opacity = '1';
        problemSection.style.transform = 'translateY(0)';
    }

    // ===================================
    // FAQ ACCORDION
    // ===================================

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // ===================================
    // SMOOTH SCROLL
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // NAVBAR ON SCROLL
    // ===================================

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===================================
    // MOBILE MENU
    // ===================================

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // ===================================
    // CONTACT FORM
    // ===================================

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = '#22c55e';
                    contactForm.reset();
                } else {
                    submitBtn.textContent = 'Error — try again';
                    submitBtn.style.background = '#ef4444';
                }
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }).catch(() => {
                submitBtn.textContent = 'Error — try again';
                submitBtn.style.background = '#ef4444';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            });
        });
    }

    // ===================================
    // INITIALIZE STAT COUNTERS
    // ===================================

    // Auto-detect stat numbers and add data attributes
    document.querySelectorAll('.stat-number').forEach(stat => {
        const text = stat.textContent.trim();
        const match = text.match(/^([\d.]+)(.*)$/);

        if (match && !stat.dataset.target) {
            stat.dataset.target = match[1];
            stat.dataset.suffix = match[2] || '';
            stat.textContent = '0' + (match[2] || '');
            counterObserver.observe(stat);
        }
    });

    // ===================================
    // LEAD MAGNET POPUP
    // ===================================
    const leadPopup = document.getElementById('lead-popup');
    if (leadPopup && !sessionStorage.getItem('lead-popup-shown')) {
        const showPopup = () => {
            if (sessionStorage.getItem('lead-popup-shown')) return;
            sessionStorage.setItem('lead-popup-shown', 'true');
            leadPopup.classList.add('active');
        };

        // Desktop: exit intent (mouse leaves viewport top)
        document.addEventListener('mouseout', function(e) {
            if (e.clientY < 10) showPopup();
        });

        // Mobile: show after scrolling 60% of page
        let scrollTriggered = false;
        window.addEventListener('scroll', function() {
            if (scrollTriggered) return;
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            if (scrollPercent > 0.6) {
                scrollTriggered = true;
                showPopup();
            }
        });

        // Fallback: show after 45 seconds
        setTimeout(showPopup, 45000);

        // Close popup
        document.getElementById('lead-popup-close').addEventListener('click', function() {
            leadPopup.classList.remove('active');
        });

        leadPopup.addEventListener('click', function(e) {
            if (e.target === leadPopup) leadPopup.classList.remove('active');
        });

        // Handle form submission
        const leadForm = document.getElementById('lead-form');
        if (leadForm) {
            leadForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const btn = leadForm.querySelector('button[type="submit"]');
                btn.textContent = 'Sending...';
                btn.disabled = true;

                fetch(leadForm.action, {
                    method: 'POST',
                    body: new FormData(leadForm),
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        leadForm.innerHTML = '<div style="text-align:center;padding:20px 0;"><p style="font-size:1.1rem;color:var(--text-primary);margin-bottom:16px;">Here\'s your guide:</p><a href="/guide/ai-strategy-guide.html" target="_blank" style="display:inline-block;background:var(--accent-dark);color:#fff;padding:14px 28px;border-radius:100px;text-decoration:none;font-weight:600;">Download the Guide</a></div>';
                    } else {
                        btn.textContent = 'Error — try again';
                        btn.disabled = false;
                    }
                }).catch(() => {
                    btn.textContent = 'Error — try again';
                    btn.disabled = false;
                });
            });
        }
    }

    // ===================================
    // FLOATING WHATSAPP BUTTON
    // ===================================
    (function() {
        var btn = document.createElement('a');
        btn.href = 'https://wa.me/6585123273?text=Hi%20Alexander%2C%20I%27m%20interested%20in%20AI%20automation%20for%20my%20business.%20Can%20we%20chat%3F';
        btn.target = '_blank';
        btn.rel = 'noopener';
        btn.setAttribute('aria-label', 'WhatsApp us');
        btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:transform 0.2s ease,box-shadow 0.2s ease;cursor:pointer;text-decoration:none;';
        btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
        btn.onmouseenter = function() { this.style.transform = 'scale(1.1)'; this.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)'; };
        btn.onmouseleave = function() { this.style.transform = 'scale(1)'; this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'; };
        document.body.appendChild(btn);
    })();

});
