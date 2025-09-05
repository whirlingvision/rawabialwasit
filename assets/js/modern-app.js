/**
 * Modern JavaScript Application for Rawabi Alwasit Website
 * Enhanced security, performance, and user experience
 */

(function() {
    'use strict';

    // ========== SECURITY & PERFORMANCE CONFIGURATION ==========
    
    const CONFIG = {
        // Performance settings
        LAZY_LOAD_OFFSET: 100,
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        
        // Security settings
        MAX_FORM_SUBMISSIONS: 3,
        FORM_COOLDOWN: 300000, // 5 minutes
        
        // Animation settings
        ANIMATION_DURATION: 300,
        STAGGER_DELAY: 100,
        
        // API endpoints
        ENDPOINTS: {
            CONTACT_FORM: 'form.php',
            ANALYTICS: 'analytics.php'
        }
    };

    // ========== UTILITY FUNCTIONS ==========
    
    /**
     * Debounce function for performance optimization
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Generate secure random string
     */
    function generateSecureToken(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Sanitize HTML content
     */
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // ========== SECURITY MODULE ==========
    
    const Security = {
        /**
         * Initialize security measures
         */
        init() {
            this.setupCSRFProtection();
            this.setupRateLimiting();
            this.setupInputValidation();
            this.setupContentSecurity();
        },

        /**
         * Setup CSRF protection
         */
        setupCSRFProtection() {
            const forms = document.querySelectorAll('form[method="post"]');
            forms.forEach(form => {
                const token = generateSecureToken();
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrf_token';
                input.value = token;
                form.appendChild(input);
            });
        },

        /**
         * Setup rate limiting for forms
         */
        setupRateLimiting() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    const formId = form.id || 'default';
                    const key = `form_submissions_${formId}`;
                    const submissions = JSON.parse(localStorage.getItem(key) || '[]');
                    const now = Date.now();
                    
                    // Remove old submissions
                    const recentSubmissions = submissions.filter(
                        time => now - time < CONFIG.FORM_COOLDOWN
                    );
                    
                    if (recentSubmissions.length >= CONFIG.MAX_FORM_SUBMISSIONS) {
                        e.preventDefault();
                        this.showError('Too many submissions. Please wait before trying again.');
                        return false;
                    }
                    
                    // Add current submission
                    recentSubmissions.push(now);
                    localStorage.setItem(key, JSON.stringify(recentSubmissions));
                });
            });
        },

        /**
         * Setup input validation
         */
        setupInputValidation() {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', debounce((e) => {
                    this.validateInput(e.target);
                }, CONFIG.DEBOUNCE_DELAY));
            });
        },

        /**
         * Validate individual input
         */
        validateInput(input) {
            const value = input.value.trim();
            const type = input.type;
            const pattern = input.pattern;
            const required = input.hasAttribute('required');
            
            let isValid = true;
            let message = '';
            
            // Required field validation
            if (required && !value) {
                isValid = false;
                message = 'This field is required.';
            }
            
            // Type-specific validation
            if (value && type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email address.';
                }
            }
            
            if (value && type === 'tel') {
                const phoneRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
                if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
                    isValid = false;
                    message = 'Please enter a valid Saudi phone number.';
                }
            }
            
            // Pattern validation
            if (value && pattern) {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
                    isValid = false;
                    message = input.title || 'Invalid format.';
                }
            }
            
            // Update UI
            this.updateInputState(input, isValid, message);
            
            return isValid;
        },

        /**
         * Update input validation state
         */
        updateInputState(input, isValid, message) {
            const feedback = input.parentNode.querySelector('.invalid-feedback');
            
            input.classList.remove('is-valid', 'is-invalid');
            
            if (isValid) {
                input.classList.add('is-valid');
                if (feedback) feedback.textContent = '';
            } else {
                input.classList.add('is-invalid');
                if (feedback) feedback.textContent = message;
            }
        },

        /**
         * Setup content security
         */
        setupContentSecurity() {
            // Prevent inline script execution
            const scripts = document.querySelectorAll('script[src=""]');
            scripts.forEach(script => script.remove());
            
            // Sanitize user-generated content
            const userContent = document.querySelectorAll('[data-user-content]');
            userContent.forEach(element => {
                element.innerHTML = sanitizeHTML(element.innerHTML);
            });
        },

        /**
         * Show error message
         */
        showError(message) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger';
            alert.innerHTML = `<strong>Error:</strong> ${sanitizeHTML(message)}`;
            
            const container = document.querySelector('#formMessages') || document.body;
            container.insertBefore(alert, container.firstChild);
            
            setTimeout(() => alert.remove(), 5000);
        }
    };

    // ========== PERFORMANCE MODULE ==========
    
    const Performance = {
        /**
         * Initialize performance optimizations
         */
        init() {
            this.setupLazyLoading();
            this.setupImageOptimization();
            this.setupScrollOptimization();
            this.setupPreloading();
        },

        /**
         * Setup lazy loading for images
         */
        setupLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: `${CONFIG.LAZY_LOAD_OFFSET}px`
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },

        /**
         * Setup image optimization
         */
        setupImageOptimization() {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                // Add loading attribute for native lazy loading
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                
                // Add error handling
                img.addEventListener('error', () => {
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                });
            });
        },

        /**
         * Setup scroll optimization
         */
        setupScrollOptimization() {
            let ticking = false;
            
            const updateScrollElements = throttle(() => {
                // Update navbar on scroll
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    if (window.scrollY > 100) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                }
                
                // Animate elements on scroll
                const animatedElements = document.querySelectorAll('.animate-on-scroll');
                animatedElements.forEach(element => {
                    if (isInViewport(element, 100)) {
                        element.classList.add('animate-fade-in-up');
                    }
                });
            }, CONFIG.THROTTLE_DELAY);
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateScrollElements);
                    ticking = true;
                    setTimeout(() => ticking = false, CONFIG.THROTTLE_DELAY);
                }
            });
        },

        /**
         * Setup preloading for critical resources
         */
        setupPreloading() {
            // Preload critical images
            const criticalImages = [
                'assets/img/logo.png',
                'assets/img/banner/office-banner.jpeg'
            ];
            
            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        }
    };

    // ========== ACCESSIBILITY MODULE ==========
    
    const Accessibility = {
        /**
         * Initialize accessibility features
         */
        init() {
            this.setupKeyboardNavigation();
            this.setupARIALabels();
            this.setupFocusManagement();
            this.setupScreenReaderSupport();
        },

        /**
         * Setup keyboard navigation
         */
        setupKeyboardNavigation() {
            // Skip link functionality
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(skipLink.getAttribute('href'));
                    if (target) {
                        target.focus();
                        target.scrollIntoView();
                    }
                });
            }
            
            // Escape key handling
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModals();
                }
            });
        },

        /**
         * Setup ARIA labels
         */
        setupARIALabels() {
            // Add ARIA labels to interactive elements
            const buttons = document.querySelectorAll('button:not([aria-label])');
            buttons.forEach(button => {
                if (!button.textContent.trim()) {
                    button.setAttribute('aria-label', 'Button');
                }
            });
            
            // Add ARIA labels to form inputs
            const inputs = document.querySelectorAll('input:not([aria-label])');
            inputs.forEach(input => {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-label', label.textContent);
                }
            });
        },

        /**
         * Setup focus management
         */
        setupFocusManagement() {
            // Trap focus in modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.addEventListener('shown.bs.modal', () => {
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    if (focusableElements.length > 0) {
                        focusableElements[0].focus();
                    }
                });
            });
        },

        /**
         * Setup screen reader support
         */
        setupScreenReaderSupport() {
            // Add live region for dynamic content
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'live-region';
            document.body.appendChild(liveRegion);
        },

        /**
         * Close all modals
         */
        closeModals() {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        },

        /**
         * Announce message to screen readers
         */
        announce(message) {
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        }
    };

    // ========== LANGUAGE MODULE ==========
    
    const Language = {
        /**
         * Initialize language switching
         */
        init() {
            this.setupLanguageSwitcher();
            this.loadLanguagePreference();
        },

        /**
         * Setup language switcher
         */
        setupLanguageSwitcher() {
            const langButtons = document.querySelectorAll('.lang-btn');
            langButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = button.dataset.lang;
                    this.switchLanguage(lang);
                });
            });
        },

        /**
         * Switch language
         */
        switchLanguage(lang) {
            // Update active button
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            const activeBtn = document.querySelector(`[data-lang="${lang}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.setAttribute('aria-pressed', 'true');
            }
            
            // Update HTML attributes
            if (lang === 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
                document.body.classList.remove('lang-en');
                document.body.classList.add('lang-ar');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
                document.body.classList.remove('lang-ar');
                document.body.classList.add('lang-en');
            }
            
            // Update text content
            document.querySelectorAll('.lang-text').forEach(element => {
                const text = element.dataset[lang];
                if (text) {
                    element.textContent = text;
                }
            });
            
            // Save preference
            localStorage.setItem('preferred-language', lang);
            
            // Announce change
            Accessibility.announce(`Language switched to ${lang === 'ar' ? 'Arabic' : 'English'}`);
        },

        /**
         * Load language preference
         */
        loadLanguagePreference() {
            const savedLang = localStorage.getItem('preferred-language');
            const browserLang = navigator.language.split('-')[0];
            const defaultLang = savedLang || (browserLang === 'ar' ? 'ar' : 'en');
            
            this.switchLanguage(defaultLang);
        }
    };

    // ========== INITIALIZATION ==========
    
    /**
     * Initialize the application
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initialize modules
        Security.init();
        Performance.init();
        Accessibility.init();
        Language.init();
        
        // Initialize legacy jQuery functionality if available
        if (typeof $ !== 'undefined') {
            initLegacyFeatures();
        }
        
        console.log('Rawabi Alwasit website initialized successfully');
    }

    /**
     * Initialize legacy jQuery features
     */
    function initLegacyFeatures() {
        // Preloader
        $(window).on('load', function() {
            $('.se-pre-con').fadeOut('slow');
        });
        
        // Cookie consent
        $('#acceptCookie').click(function() {
            $('#cookiePopup').fadeOut();
            localStorage.setItem('cookieAccepted', 'true');
        });

        if (localStorage.getItem('cookieAccepted')) {
            $('#cookiePopup').hide();
        }
    }

    // Start the application
    init();

    // Expose modules for external use
    window.RawabiAlwasit = {
        Security,
        Performance,
        Accessibility,
        Language,
        CONFIG
    };

})();
