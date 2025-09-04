/* ========== PERFORMANCE OPTIMIZATION & REUSABLE FUNCTIONS ========== */

// Performance monitoring
const performanceMonitor = {
    startTime: performance.now(),
    
    measureTime(label) {
        const endTime = performance.now();
        const duration = endTime - this.startTime;
        console.log(`${label}: ${duration.toFixed(2)}ms`);
        return duration;
    },
    
    logMemoryUsage() {
        if (performance.memory) {
            console.log('Memory Usage:', {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
            });
        }
    }
};

// Lazy loading for images
const lazyLoader = {
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    },

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
};

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for performance
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
    }
}

// Smooth scrolling utility
const smoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// Form validation utility
const formValidator = {
    init() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
            this.addValidationListeners(form);
        });
    },

    addValidationListeners(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    },

    showFieldError(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error alert alert-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    },

    clearFieldError(field) {
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
            field.classList.remove('is-invalid');
        }
    },

    handleSubmit(e) {
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            this.showFormError(form, 'Please correct the errors above');
        }
    },

    showFormError(form, message) {
        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error alert alert-error';
        errorDiv.textContent = message;
        form.insertBefore(errorDiv, form.firstChild);
    }
};

// Cookie management utility
const cookieManager = {
    set(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    },

    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    delete(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

// Local storage utility
const storageManager = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Local storage not available:', e);
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Error reading from local storage:', e);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Error removing from local storage:', e);
        }
    }
};

// Analytics utility
const analytics = {
    trackEvent(category, action, label = null, value = null) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        // Custom analytics tracking
        this.logEvent(category, action, label, value);
    },

    logEvent(category, action, label, value) {
        console.log('Analytics Event:', { category, action, label, value });
        
        // Store in local storage for offline tracking
        const events = storageManager.get('analytics_events', []);
        events.push({
            timestamp: Date.now(),
            category,
            action,
            label,
            value
        });
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        storageManager.set('analytics_events', events);
    },

    trackPageView(page) {
        this.trackEvent('Navigation', 'Page View', page);
    },

    trackFormSubmission(formName) {
        this.trackEvent('Form', 'Submission', formName);
    },

    trackButtonClick(buttonName) {
        this.trackEvent('Interaction', 'Button Click', buttonName);
    }
};

// Performance optimization functions
const performanceOptimizer = {
    init() {
        this.optimizeImages();
        this.optimizeFonts();
        this.addIntersectionObserver();
        this.optimizeAnimations();
    },

    optimizeImages() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach((img, index) => {
            if (index > 3) { // Skip first 4 images
                img.loading = 'lazy';
            }
        });
    },

    optimizeFonts() {
        // Preload critical fonts
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            link.rel = 'preload';
            link.as = 'font';
            link.crossOrigin = 'anonymous';
        });
    },

    addIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            });

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }
    },

    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
    }
};

// Initialize all optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    performanceMonitor.measureTime('DOM Ready');
    
    // Initialize all utilities
    lazyLoader.init();
    smoothScroll.init();
    formValidator.init();
    performanceOptimizer.init();
    
    // Track page view
    analytics.trackPageView(window.location.pathname);
    
    performanceMonitor.measureTime('Initialization Complete');
});

// Performance monitoring on page load
window.addEventListener('load', function() {
    performanceMonitor.measureTime('Page Load Complete');
    performanceMonitor.logMemoryUsage();
    
    // Send performance metrics to analytics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        analytics.trackEvent('Performance', 'Page Load', 'Load Time', perfData.loadEventEnd - perfData.loadEventStart);
    }
});

// Export utilities for global use
window.RawabiUtils = {
    debounce,
    throttle,
    smoothScroll,
    formValidator,
    cookieManager,
    storageManager,
    analytics,
    performanceMonitor
};
