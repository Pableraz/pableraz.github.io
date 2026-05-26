document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'light';
        
        if (currentTheme === 'light') {
            newTheme = 'dark';
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Language Toggle Logic
    const langToggleBtn = document.getElementById('lang-toggle');
    const savedLang = localStorage.getItem('lang') || 'en';
    
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        if(langToggleBtn) langToggleBtn.textContent = lang === 'en' ? 'ES' : 'EN';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('lang', lang);
    }
    
    // Initialize Language
    setLanguage(savedLang);
    
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('lang') || 'en';
            setLanguage(currentLang === 'en' ? 'es' : 'en');
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.style.color = 'var(--text-main)'; // reset
            if (item.getAttribute('href') === `#${current}`) {
                item.style.color = 'var(--primary-color)';
            }
        });
    });
});

// =========================================
// Gallery Modal Logic
// =========================================
const galleryImages = [
    { src: 'images/HOMELAB_IMAGES/PHYSICAL_HOMELAB.jpeg', titleKey: 'slide1-title', descKey: 'slide1-desc' },
    { src: 'images/HOMELAB_IMAGES/PROXMOX_DASHBOARD.png', titleKey: 'slide2-title', descKey: 'slide2-desc' },
    { src: 'images/HOMELAB_IMAGES/PROXMOX_BTOP.png', titleKey: 'slide3-title', descKey: 'slide3-desc' },
    { src: 'images/HOMELAB_IMAGES/OPENMEDIAVAULT_DASHBOARD.png', titleKey: 'slide4-title', descKey: 'slide4-desc' },
    { src: 'images/HOMELAB_IMAGES/PI_ADGUARD_DASHBOARD.png', titleKey: 'slide5-title', descKey: 'slide5-desc' },
    { src: 'images/HOMELAB_IMAGES/IMMICH_DASHBOARD.png', titleKey: 'slide6-title', descKey: 'slide6-desc' }
];

let currentSlideIndex = 0;

window.openGallery = function() {
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    initGallery();
    goToSlide(0);
};

window.closeGallery = function() {
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

window.changeSlide = function(step) {
    let nextIndex = currentSlideIndex + step;
    if (nextIndex >= galleryImages.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = galleryImages.length - 1;
    goToSlide(nextIndex);
};

window.goToSlide = function(index) {
    currentSlideIndex = index;
    const slide = galleryImages[index];
    
    // Update Image
    const imgEl = document.getElementById('modal-image');
    if (imgEl) {
        imgEl.style.opacity = 0;
        setTimeout(() => {
            imgEl.src = slide.src;
            imgEl.style.opacity = 1;
        }, 200);
    }

    // Update Text Translation Keys
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    
    if (titleEl && descEl) {
        titleEl.setAttribute('data-i18n', slide.titleKey);
        descEl.setAttribute('data-i18n', slide.descKey);
        
        // Trigger translation update for the modal text
        const lang = localStorage.getItem('lang') || 'en';
        if (typeof translations !== 'undefined' && translations[lang]) {
            titleEl.innerHTML = translations[lang][slide.titleKey];
            descEl.innerHTML = translations[lang][slide.descKey];
        }
    }
    
    // Update Dots
    document.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
    
    // Update Thumbnails
    document.querySelectorAll('.thumbnail-img').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
        if (idx === index && thumb.scrollIntoView) {
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });
};

function initGallery() {
    // Only initialize once
    const dotsContainer = document.getElementById('modal-dots');
    const thumbsContainer = document.getElementById('modal-thumbnails');
    
    if (dotsContainer && thumbsContainer && dotsContainer.children.length === 0) {
        galleryImages.forEach((img, idx) => {
            // Create dot
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.onclick = () => window.goToSlide(idx);
            dotsContainer.appendChild(dot);
            
            // Create thumbnail
            const thumb = document.createElement('img');
            thumb.src = img.src;
            thumb.className = 'thumbnail-img';
            thumb.alt = `Thumbnail ${idx + 1}`;
            thumb.onclick = () => window.goToSlide(idx);
            thumbsContainer.appendChild(thumb);
        });
    }
}

// Global Event Listeners for Gallery
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (modal && modal.classList.contains('show')) {
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === 'ArrowLeft') changeSlide(-1);
    }
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('gallery-modal');
    // If click is on the modal background itself (not the content)
    if (modal && modal.classList.contains('show') && e.target === modal) {
        closeGallery();
    }
});
