// Rawabi Alwasit Company - Main JavaScript

// Ensure Bootstrap CSS is present; if local file is blocked online, inject CDN
(function ensureBootstrapCss() {
    try {
        // Wait a moment for CSS to apply, then check a Bootstrap token class
        setTimeout(function() {
            var test = document.createElement('div');
            test.className = 'd-none'; // should compute to display: none when Bootstrap is present
            document.body.appendChild(test);
            var hasBootstrap = window.getComputedStyle(test).display === 'none';
            document.body.removeChild(test);
            if (!hasBootstrap) {
                var cdn = document.createElement('link');
                cdn.rel = 'stylesheet';
                cdn.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
                cdn.crossOrigin = 'anonymous';
                cdn.integrity = 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH';
                document.head.appendChild(cdn);
                console.log('Local Bootstrap CSS missing; injected CDN fallback.');
            }
        }, 600);
    } catch (e) {
        // ignore
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeLanguageToggle();
    initializeScrollEffects();
    initializeAnimations();
    initializeMobileMenu();
    initializeDropdowns();
    initializeFormValidation();
    initializeMapFallback();
});

// Navigation functionality
function initializeNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Active navigation highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Map fallback initializer (moved from inline script to satisfy CSP)
function initializeMapFallback() {
    try {
        var googleFrame = document.getElementById('googleMap');
        var osmFrame = document.getElementById('osmMap');
        var fallbackDiv = document.getElementById('mapFallback');
        if (!googleFrame && !osmFrame && !fallbackDiv) return; // not on contact page

        var googleLoaded = false;
        if (fallbackDiv) { fallbackDiv.style.display = 'block'; }
        if (googleFrame) {
            googleFrame.addEventListener('load', function() { googleLoaded = true; });
        }
        setTimeout(function() {
            if (!googleLoaded && osmFrame) {
                osmFrame.style.display = 'block';
                var osmLoaded = false;
                osmFrame.addEventListener('load', function() { osmLoaded = true; });
                setTimeout(function(){ if (!osmLoaded && fallbackDiv) { fallbackDiv.style.display = 'block'; } }, 3000);
            }
        }, 4000);
    } catch (e) {
        // noop
    }
}

// Language toggle functionality
function initializeLanguageToggle() {
    const languageToggle = document.querySelector('.language-toggle');
    const html = document.documentElement;
    
    // Get current language from localStorage or default to English
    let currentLang = localStorage.getItem('language') || 'en';
    setLanguage(currentLang);
    
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            setLanguage(currentLang);
            localStorage.setItem('language', currentLang);
        });
    }
    
    function setLanguage(lang) {
        if (lang === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            updateTextContent('ar');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            updateTextContent('en');
        }
    }
    
    function updateTextContent(lang) {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Animate counters if present
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('.section, .service-card, .product-card');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Counter animation
function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize animations
function initializeAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.service-card, .product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
            
            // Animate hamburger icon
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = navbarCollapse.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
                navbarToggler.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
                navbarToggler.classList.remove('active');
            }
        });
    }
}

// Dropdown functionality with improved stability
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    let activeDropdown = null;
    let dropdownTimeout = null;
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Desktop behavior
            if (window.innerWidth >= 992) {
                // Show dropdown on hover with delay
                dropdown.addEventListener('mouseenter', function() {
                    clearTimeout(dropdownTimeout);
                    
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            const m = d.querySelector('.dropdown-menu');
                            if (m) {
                                m.style.display = 'none';
                                m.style.opacity = '0';
                                m.style.transform = 'translateY(-10px)';
                            }
                        }
                    });
                    
                    // Show current dropdown
                    menu.style.display = 'block';
                    setTimeout(() => {
                        menu.style.opacity = '1';
                        menu.style.transform = 'translateY(0)';
                    }, 10);
                    
                    activeDropdown = dropdown;
                });
                
                // Hide dropdown on leave with delay
                dropdown.addEventListener('mouseleave', function() {
                    dropdownTimeout = setTimeout(() => {
                        if (activeDropdown === dropdown) {
                            menu.style.opacity = '0';
                            menu.style.transform = 'translateY(-10px)';
                            setTimeout(() => {
                                menu.style.display = 'none';
                            }, 200);
                            activeDropdown = null;
                        }
                    }, 500); // Increased delay to 500ms
                });
                
                // Keep dropdown open when hovering over menu items
                menu.addEventListener('mouseenter', function() {
                    clearTimeout(dropdownTimeout);
                });
                
                menu.addEventListener('mouseleave', function() {
                    dropdownTimeout = setTimeout(() => {
                        menu.style.opacity = '0';
                        menu.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            menu.style.display = 'none';
                        }, 200);
                        activeDropdown = null;
                    }, 300);
                });
            }
            
            // Mobile and tablet click behavior
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (window.innerWidth < 992) {
                    const isOpen = menu.style.display === 'block';
                    
                    // Close all other dropdowns
                    dropdowns.forEach(d => {
                        const m = d.querySelector('.dropdown-menu');
                        if (m && m !== menu) {
                            m.style.display = 'none';
                            m.style.opacity = '0';
                        }
                    });
                    
                    // Toggle current dropdown
                    if (isOpen) {
                        menu.style.display = 'none';
                        menu.style.opacity = '0';
                        activeDropdown = null;
                    } else {
                        menu.style.display = 'block';
                        menu.style.opacity = '1';
                        activeDropdown = dropdown;
                    }
                } else {
                    // Desktop click behavior - toggle dropdown
                    const isOpen = menu.style.display === 'block' && menu.style.opacity === '1';
                    
                    if (isOpen) {
                        menu.style.opacity = '0';
                        menu.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            menu.style.display = 'none';
                        }, 200);
                        activeDropdown = null;
                    } else {
                        // Close other dropdowns
                        dropdowns.forEach(d => {
                            if (d !== dropdown) {
                                const m = d.querySelector('.dropdown-menu');
                                if (m) {
                                    m.style.display = 'none';
                                    m.style.opacity = '0';
                                    m.style.transform = 'translateY(-10px)';
                                }
                            }
                        });
                        
                        // Show current dropdown
                        menu.style.display = 'block';
                        setTimeout(() => {
                            menu.style.opacity = '1';
                            menu.style.transform = 'translateY(0)';
                        }, 10);
                        activeDropdown = dropdown;
                    }
                }
            });
            
            // Prevent dropdown from closing when clicking inside menu
            menu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = 'none';
                    menu.style.opacity = '0';
                    menu.style.transform = 'translateY(-10px)';
                }
            });
            activeDropdown = null;
            clearTimeout(dropdownTimeout);
        }
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeDropdown) {
            const menu = activeDropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.opacity = '0';
                menu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    menu.style.display = 'none';
                }, 200);
            }
            activeDropdown = null;
            clearTimeout(dropdownTimeout);
        }
    });
}

// Form validation and submission
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Only add listener if form doesn't already have custom handler
        const formId = form.id;
        if (formId === 'contactForm') {
            // Contact form - ensure it's handled
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const isValid = validateForm(this);
                
                if (isValid) {
                    submitForm(this, formData);
                }
            });
        } else {
            // Other forms
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const isValid = validateForm(this);
                
                if (isValid) {
                    submitForm(this, formData);
                }
            });
        }
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.parentNode.querySelector('.error-message');
        
        // Remove existing error
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('error');
        
        // Validate required fields
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
            return;
        }
        
        // Validate email
        if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
            return;
        }
        
        // Validate phone (Saudi format)
        if (input.type === 'tel' && !isValidSaudiPhone(value)) {
            showFieldError(input, 'Please enter a valid Saudi phone number');
            isValid = false;
            return;
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidSaudiPhone(phone) {
    const phoneRegex = /^(\+966|966|0)?[5][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

async function submitForm(form, formData) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalHTML = submitButton.innerHTML;
    
    // Show loading state with icon
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitButton.disabled = true;
    
    try {
        // Check if access_key is already in formData
        if (!formData.has('access_key')) {
            formData.append('access_key', 'c6f1aa00-834a-40d4-8ca2-b77b600fdc83');
        }
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData,
            redirect: 'follow'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFormMessage(form, 'Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            form.reset();
        } else {
            // Provide a clearer hint if domain is not allowed on Web3Forms
            const msg = /domain|origin|unauthorized/i.test(String(result.message))
                ? 'Form service blocked this domain. Please add rawabialwasit.com to the allowed domains in Web3Forms settings and try again.'
                : (result.message || 'Form submission failed');
            throw new Error(msg);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        // As a fallback (e.g., CORS/adblock on production), do a native POST submit.
        try {
            // Create a hidden input to indicate fallback path if needed by the service
            const fallbackFlag = document.createElement('input');
            fallbackFlag.type = 'hidden';
            fallbackFlag.name = 'fallback_submit';
            fallbackFlag.value = '1';
            form.appendChild(fallbackFlag);
            // Native submit does not trigger submit handlers again
            form.submit();
            return; // stop further UI handling; browser will navigate
        } catch (nativeErr) {
            // If native submit also fails, offer a mailto fallback with prefilled content
            try {
                var name = form.querySelector('#name')?.value || '';
                var email = form.querySelector('#email')?.value || '';
                var phone = form.querySelector('#phone')?.value || '';
                var subj = form.querySelector('#subject')?.value || 'General Inquiry';
                var msg = form.querySelector('#message')?.value || '';
                var body = encodeURIComponent(
                    'Name: ' + name + '\n' +
                    'Email: ' + email + '\n' +
                    'Phone: ' + phone + '\n' +
                    'Subject: ' + subj + '\n\n' +
                    msg
                );
                var mailto = 'mailto:info@rawabialwasit.com?subject=' + encodeURIComponent('Website Contact: ' + subj) + '&body=' + body;
                showFormMessage(form, 'We could not send your message automatically. Please click the button below to email us directly.', 'error');
                var container = form.querySelector('.form-message.error');
                if (container) {
                    var a = document.createElement('a');
                    a.href = mailto;
                    a.className = 'btn btn-primary mt-2';
                    a.textContent = 'Open Email App';
                    container.appendChild(a);
                }
            } catch (e2) {
                showFormMessage(form, 'Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            }
        }
    } finally {
        // Reset button state
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
    }
}

function showFormMessage(form, message, type) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    form.insertBefore(messageElement, form.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Utility functions
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

// Performance optimizations
const debouncedResize = debounce(() => {
    // Reinitialize components that depend on window size
    initializeDropdowns();
}, 250);

window.addEventListener('resize', debouncedResize);

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if images with data-src exist
if (document.querySelectorAll('img[data-src]').length > 0) {
    initializeLazyLoading();
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

