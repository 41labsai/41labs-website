/* 41 Closer landing kit behaviour — extracted from 41-closer.html on 2026-07-02. */
(function(){
            if(!('IntersectionObserver' in window)) return;
            var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            // Scroll reveals
            if(!reduce){
                var sel = '.clo-section .clo-eyebrow,.clo-section h2,.clo-section .clo-lead,.clo-vs-col,.clo-step,.clo-cost,.clo-tier,.clo-stat,.clo-safe-card,.clo-faq-item,.clo-qr-card,.clo-reassure';
                var els = [].slice.call(document.querySelectorAll(sel));
                els.forEach(function(el){ el.classList.add('reveal'); });
                var io = new IntersectionObserver(function(entries){
                    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
                }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
                els.forEach(function(el){ io.observe(el); });
                ['.clo-tiers','.clo-steps','.clo-safe','.clo-costs','.clo-stats'].forEach(function(g){
                    document.querySelectorAll(g).forEach(function(group){
                        [].slice.call(group.children).forEach(function(c,i){ c.style.transitionDelay = (i*0.08)+'s'; });
                    });
                });
            }
            // Animated chat
            var chat = document.getElementById('clo-chat');
            if(chat && !reduce){
                var cio = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ chat.classList.add('play'); cio.disconnect(); } }); }, { threshold:.4 });
                cio.observe(chat);
            } else if(chat){ chat.classList.remove('clo-anim'); }
            // Count-up stats
            var counted = false;
            function countUp(el){
                var target = parseFloat(el.getAttribute('data-count'));
                var pre = el.getAttribute('data-prefix')||'', suf = el.getAttribute('data-suffix')||'';
                var dur = 1400, start = null;
                function step(ts){ if(!start) start = ts; var p = Math.min((ts-start)/dur,1); var val = Math.round(target*(0.5-Math.cos(p*Math.PI)/2)); el.textContent = pre+val+suf; if(p<1) requestAnimationFrame(step); }
                requestAnimationFrame(step);
            }
            var statWrap = document.querySelector('.clo-stats');
            if(statWrap){
                var sio = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting && !counted){ counted = true; document.querySelectorAll('.clo-stat b[data-count]').forEach(function(b){ reduce ? (b.textContent=(b.getAttribute('data-prefix')||'')+b.getAttribute('data-count')+(b.getAttribute('data-suffix')||'')) : countUp(b); }); sio.disconnect(); } }); }, { threshold:.4 });
                sio.observe(statWrap);
            }
        })();
    

        (function(){
            document.querySelectorAll('a[href*="wa.me/6580124848"]').forEach(function(a){
                a.addEventListener('click', function(){ if(window.fbq){ fbq('track','Contact',{content_name:'pricing_whatsapp'}); } });
            });
        })();
