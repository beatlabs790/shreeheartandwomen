/* -------------------------------------------------------------
   Shree Heart & Women Care Clinic - Shared Javascript Functions
   Features: Theme Switcher, Mobile Navigation, Shree AI Chatbot, 
             Dynamic Backdrop Blobs, Cookie Consent Injection,
             Scroll Reveal Intersection Observers
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    injectBackgroundBlobs();
    initTheme();
    initMobileMenu();
    initShreeAI();
    initCookieConsent();
    initScrollReveal();
});

/* -------------------------------------------------------------
   0. INJECT METRIC BACKDROP BLOBS
   ------------------------------------------------------------- */
function injectBackgroundBlobs() {
    const blobs = document.createElement('div');
    blobs.className = 'bg-blobs';
    blobs.innerHTML = `
        <div class="bg-blob bg-blob-1"></div>
        <div class="bg-blob bg-blob-2"></div>
        <div class="bg-blob bg-blob-3"></div>`;
    document.body.insertBefore(blobs, document.body.firstChild);
}

/* -------------------------------------------------------------
   1. DARK MODE / THEME TOGGLER LOGIC
   ------------------------------------------------------------- */
function initTheme() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply stored theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateToggleIcons(true);
    } else {
        document.body.classList.remove('dark-theme');
        updateToggleIcons(false);
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateToggleIcons(isDark);
        });
    });
}

function updateToggleIcons(isDark) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
        if (isDark) {
            btn.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
                </svg>`;
        } else {
            btn.innerHTML = `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>`;
        }
    });
}

/* -------------------------------------------------------------
   2. MOBILE NAVIGATION LOGIC
   ------------------------------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }
}

/* -------------------------------------------------------------
   3. SHREE AI CHATBOT LOGIC
   ------------------------------------------------------------- */
function initShreeAI() {
    const trigger = document.getElementById('shree-ai-trigger');
    const frame = document.getElementById('shree-ai-frame');
    const closeBtn = document.getElementById('shree-ai-close');
    const sendBtn = document.getElementById('shree-ai-send');
    const input = document.getElementById('shree-ai-input');
    const messageContainer = document.getElementById('shree-ai-messages');
    const chips = document.querySelectorAll('.chip-btn');

    if (!trigger || !frame) return;

    trigger.addEventListener('click', () => {
        frame.classList.toggle('open');
        if (messageContainer.children.length === 0) {
            appendBotMessage("Hello! I am Shree AI, your virtual assistant for Shree Heart & Women Care Clinic. How can I help you today?");
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            frame.classList.remove('open');
        });
    }

    if (sendBtn && input) {
        sendBtn.addEventListener('click', handleUserSubmit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserSubmit();
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const queryText = chip.getAttribute('data-query');
            const chipLabel = chip.textContent;
            
            appendUserMessage(chipLabel);
            respondToQuery(queryText);
        });
    });

    function handleUserSubmit() {
        const text = input.value.trim();
        if (!text) return;

        appendUserMessage(text);
        input.value = '';

        respondToQuery(text.toLowerCase());
    }

    function appendUserMessage(text) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-msg user';
        bubble.textContent = text;
        messageContainer.appendChild(bubble);
        scrollToBottom();
    }

    function appendBotMessage(text, isHtml = false) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-msg bot';
        if (isHtml) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }
        messageContainer.appendChild(bubble);
        scrollToBottom();
    }

    // Typing Indicators
    function showTypingIndicator() {
        const bubble = document.createElement('div');
        bubble.className = 'chat-msg bot typing-indicator-bubble';
        bubble.id = 'shree-ai-typing';
        bubble.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>`;
        messageContainer.appendChild(bubble);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('shree-ai-typing');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    function respondToQuery(query) {
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            
            if (query.includes('book') || query.includes('appointment') || query.includes('sched')) {
                const whatsappMsg = encodeURIComponent("Hello Shree Heart & Women Care Clinic, I would like to book an appointment. Please guide me with slot openings.");
                const whatsappUrl = `https://wa.me/919693762649?text=${whatsappMsg}`;
                
                appendBotMessage(`To book an appointment, you can call us at <strong>9693762649</strong> / <strong>8292791555</strong>, or tap the button below to message us directly on WhatsApp:<br><br><a href="${whatsappUrl}" target="_blank" class="btn btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.8rem; display: inline-flex; border-radius: 12px; margin-top: 5px;">📲 Chat on WhatsApp</a>`, true);
            } 
            else if (query.includes('address') || query.includes('location') || query.includes('map') || query.includes('pillar') || query.includes('reach')) {
                appendBotMessage(`We are located at:<br><strong>Pillar No: 55, Bailey Road, Raja Bazar, Sheikhpura, Patna, Bihar 800014</strong>.<br><br>Directions:<br>🚍 Bus/Auto: Stop at Raja Bazar Flyover.<br>🚇 Metro: Sheikhpura/Raja Bazar stop (upcoming).`, true);
            } 
            else if (query.includes('timings') || query.includes('hours') || query.includes('open') || query.includes('time')) {
                appendBotMessage(`Our clinic timings are:<br><strong>Sunday to Friday: 8:30 AM - 7:30 PM</strong>.<br><br><span style="color:var(--secondary); font-weight:bold;">Saturdays: Closed</span> for sanitization.`, true);
            } 
            else if (query.includes('doctor') || query.includes('specialist') || query.includes('director') || query.includes('jwala') || query.includes('sanjita')) {
                appendBotMessage(`We have two primary medical specialists:<br><br>1. <strong>Dr. Jwala</strong> (DM, Cardiologist): Specializes in coronary care, heart failure, and blood pressure management.<br>2. <strong>Dr. Sanjita</strong> (MD, Gynaecologist): Specializes in maternal-fetal medicine and high-risk pregnancy support.`, true);
            } 
            else if (query.includes('emergency') || query.includes('pain') || query.includes('chest') || query.includes('urgent')) {
                appendBotMessage(`<span style="color:#ef4444; font-weight:bold;">⚠️ Emergency Notice:</span> If you are experiencing acute chest pain, cardiac distress, or obstetric emergencies, call us immediately at <strong>9693762649</strong>, or report to the nearest hospital ER.`, true);
            } 
            else if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings')) {
                appendBotMessage(`Hello! How can I assist you with your clinic booking, Doctor information, or clinic timings today?`);
            } 
            else {
                appendBotMessage(`I'm not sure about that query, but I can help you book appointments, look up timings, clinic address, or find doctor bios. Alternatively, call us directly at <strong>9693762649</strong>.`);
            }
        }, 800);
    }
}

/* -------------------------------------------------------------
   4. COOKIE CONSENT BANNER LOGIC
   ------------------------------------------------------------- */
function initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;

    const consentContainer = document.createElement('div');
    consentContainer.className = 'cookie-consent';
    consentContainer.id = 'cookie-consent';
    consentContainer.innerHTML = `
        <div class="cookie-header">
            <span style="font-size: 1.25rem;">🍪</span>
            <h4>Cookie Consent</h4>
        </div>
        <p class="cookie-text">We use cookies to optimize clinic appointments booking and analyze traffic. By clicking "Accept All", you agree to our clinic's web privacy protocols. Read our <a href="privacy.html">Privacy Policy</a> to learn more.</p>
        <div class="cookie-actions">
            <button class="btn btn-outline" id="cookie-decline">Decline</button>
            <button class="btn btn-primary" id="cookie-accept">Accept All</button>
        </div>`;
    document.body.appendChild(consentContainer);

    setTimeout(() => {
        consentContainer.classList.add('show');
    }, 1500);

    document.getElementById('cookie-accept').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        consentContainer.classList.remove('show');
        setTimeout(() => consentContainer.remove(), 600);
    });

    document.getElementById('cookie-decline').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        consentContainer.classList.remove('show');
        setTimeout(() => consentContainer.remove(), 600);
    });
}

/* -------------------------------------------------------------
   5. INTERSECTION OBSERVER FOR SCROLL REVEAL (PREMIUM MOTION)
   ------------------------------------------------------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.08, // Start slightly after entering
        rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => observer.observe(el));
}
