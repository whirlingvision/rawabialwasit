/* ===================================================================
    
    Author          : Valid Theme (Adapted for Rawabi Al Wasit)
    Template Name   : Rawabi Al Wasit - Bilingual Website
    Version         : 2.0
    
* ================================================================= */

(function($) {
    "use strict";

    $(document).ready(function () {

        /* ==================================================
            # Preloader - Handled by inline script in HTML
         ===============================================*/

        /* ==================================================
            # Wow Init
         ===============================================*/
        if (typeof WOW !== 'undefined') {
            var wow = new WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: true,
                live: true
            });
            wow.init();
        }

        /* ==================================================
            # Banner Animation
        ===============================================*/
        function doAnimations(elems) {
            var animEndEv = 'webkitAnimationEnd animationend';
            elems.each(function() {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function() {
                    $this.removeClass($animationType);
                });
            });
        }

        // Variables on page load
        var $immortalCarousel = $('.animate_text'),
            $firstAnimatingElems = $immortalCarousel.find('.item:first').find("[data-animation ^= 'animated']");
        
        // Initialize carousel if it exists
        if ($immortalCarousel.length && typeof $.fn.carousel !== 'undefined') {
            $immortalCarousel.carousel();
            // Animate captions in first slide on page load
            doAnimations($firstAnimatingElems);
            // Other slides to be animated on carousel slide event
            $immortalCarousel.on('slide.bs.carousel', function(e) {
                var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
                doAnimations($animatingElems);
            });
        }

        /* ==================================================
            # imagesLoaded active
        ===============================================*/
        if ($('#portfolio-grid, .blog-masonry').length && typeof $.fn.imagesLoaded !== 'undefined') {
            $('#portfolio-grid,.blog-masonry').imagesLoaded(function() {

                /* Filter menu */
                $('.mix-item-menu').on('click', 'button', function() {
                    var filterValue = $(this).attr('data-filter');
                    if ($grid && typeof $.fn.isotope !== 'undefined') {
                        $grid.isotope({
                            filter: filterValue
                        });
                    }
                });

                /* filter menu active class  */
                $('.mix-item-menu button').on('click', function(event) {
                    $(this).siblings('.active').removeClass('active');
                    $(this).addClass('active');
                    event.preventDefault();
                });

                /* Filter active */
                if (typeof $.fn.isotope !== 'undefined') {
                    var $grid = $('#portfolio-grid').isotope({
                        itemSelector: '.pf-item',
                        percentPosition: true,
                        masonry: {
                            columnWidth: '.pf-item',
                        }
                    });

                    /* Filter active */
                    $('.blog-masonry').isotope({
                        itemSelector: '.blog-item',
                        percentPosition: true,
                        masonry: {
                            columnWidth: '.blog-item',
                        }
                    });
                }
            });
        }

        /* ==================================================
            # Fun Factor Init
        ===============================================*/
        if ($('.timer').length && typeof $.fn.countTo !== 'undefined') {
            $('.timer').countTo();
        }

        /* ==================================================
            # Magnific popup init
         ===============================================*/
        if ($.fn.magnificPopup) {
            $(".popup-link").magnificPopup({
                type: 'image'
            });

            $(".popup-gallery").magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true
                }
            });

            $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
                type: "iframe",
                mainClass: "mfp-fade",
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });

            $('.magnific-mix-gallery').each(function() {
                var $container = $(this);
                var $imageLinks = $container.find('.item');

                var items = [];
                $imageLinks.each(function() {
                    var $item = $(this);
                    var type = 'image';
                    if ($item.hasClass('magnific-iframe')) {
                        type = 'iframe';
                    }
                    var magItem = {
                        src: $item.attr('href'),
                        type: type
                    };
                    magItem.title = $item.data('title');
                    items.push(magItem);
                });

                $imageLinks.magnificPopup({
                    mainClass: 'mfp-fade',
                    items: items,
                    gallery: {
                        enabled: true,
                        tPrev: $(this).data('prev-text'),
                        tNext: $(this).data('next-text')
                    },
                    type: 'image',
                    callbacks: {
                        beforeOpen: function() {
                            var index = $imageLinks.index(this.st.el);
                            if (-1 !== index) {
                                this.goTo(index);
                            }
                        }
                    }
                });
            });
        }

        /* ==================================================
            # Services Carousel
         ===============================================*/
        if ($.fn.owlCarousel && $('.services-carousel').length) {
            $('.services-carousel').owlCarousel({
                loop: false,
                margin: 30,
                nav: false,
                navText: [
                    "<i class='fa fa-angle-left'></i>",
                    "<i class='fa fa-angle-right'></i>"
                ],
                dots: true,
                autoplay: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    800: {
                        items: 2
                    },
                    1000: {
                        items: 3
                    }
                }
            });
        }

        /* ==================================================
            # Testimonials Carousel
         ===============================================*/
        if ($.fn.owlCarousel && $('.testimonials-carousel').length) {
            $('.testimonials-carousel').owlCarousel({
                loop: true,
                margin: 30,
                nav: false,
                navText: [
                    "<i class='fa fa-angle-left'></i>",
                    "<i class='fa fa-angle-right'></i>"
                ],
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    1000: {
                        items: 3
                    }
                }
            });
        }

        /* ==================================================
            # Team Carousel
         ===============================================*/
        if ($.fn.owlCarousel && $('.team-carousel').length) {
            $('.team-carousel').owlCarousel({
                loop: true,
                margin: 30,
                nav: false,
                navText: [
                    "<i class='fa fa-angle-left'></i>",
                    "<i class='fa fa-angle-right'></i>"
                ],
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    1000: {
                        items: 4
                    }
                }
            });
        }

        /* ==================================================
            # Blog Carousel
         ===============================================*/
        if ($.fn.owlCarousel && $('.blog-carousel').length) {
            $('.blog-carousel').owlCarousel({
                loop: true,
                margin: 30,
                nav: false,
                navText: [
                    "<i class='fa fa-angle-left'></i>",
                    "<i class='fa fa-angle-right'></i>"
                ],
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 2
                    },
                    1000: {
                        items: 3
                    }
                }
            });
        }

        /* ==================================================
            # Smooth Scrolling
         ===============================================*/
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 1000);
                    return false;
                }
            }
        });

        /* ==================================================
            # Navbar Scroll Effect
         ===============================================*/
        $(window).scroll(function() {
            if ($(window).scrollTop() > 50) {
                $('.navbar-default').addClass('navbar-scrolled');
            } else {
                $('.navbar-default').removeClass('navbar-scrolled');
            }
        });

        /* ==================================================
            # Back to Top Button
         ===============================================*/
        $(window).scroll(function() {
            if ($(this).scrollTop() > 200) {
                $('.back-to-top').fadeIn();
            } else {
                $('.back-to-top').fadeOut();
            }
        });

        $('.back-to-top').click(function() {
            $('html, body').animate({scrollTop: 0}, 800);
            return false;
        });

        /* ==================================================
            # Cookie Consent
         ===============================================*/
        $('#acceptCookie').click(function() {
            $('#cookiePopup').fadeOut();
            localStorage.setItem('cookieAccepted', 'true');
        });

        if (localStorage.getItem('cookieAccepted')) {
            $('#cookiePopup').hide();
        }

        /* ==================================================
            # Language Switcher - Enhanced Translation System
         ===============================================*/
        
        // Language switching function
        function switchLanguage(lang) {
            console.log('Switching to language:', lang);
            
            // Update button states
            $('.lang-btn, .lang-btn-inline').removeClass('active');
            $('.lang-btn[data-lang="' + lang + '"], .lang-btn-inline[data-lang="' + lang + '"]').addClass('active');
            
            // Update HTML attributes
            if (lang === 'ar') {
                $('html').attr('dir', 'rtl').attr('lang', 'ar');
                $('body').removeClass('lang-en').addClass('lang-ar');
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
                console.log('Applied RTL layout');
            } else {
                $('html').attr('dir', 'ltr').attr('lang', 'en');
                $('body').removeClass('lang-ar').addClass('lang-en');
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
                console.log('Applied LTR layout');
            }
            
            // Update all language-specific text
            let translatedCount = 0;
            $('.lang-text').each(function() {
                const $element = $(this);
                const text = $element.data(lang);
                if (text) {
                    // Handle different types of content
                    if ($element.is('input[type="text"], input[type="email"], input[type="tel"], textarea')) {
                        $element.attr('placeholder', text);
                    } else if ($element.is('input[type="submit"], button')) {
                        $element.val(text);
                    } else {
                        $element.text(text);
                    }
                    translatedCount++;
                }
            });
            
            // Update page title
            const pageTitle = $('title').data(lang);
            if (pageTitle) {
                $('title').text(pageTitle);
                console.log('Updated page title to:', pageTitle);
            }
            
            // Save language preference
            localStorage.setItem('selectedLanguage', lang);
            
            console.log('Language switched to:', lang, '- Translated', translatedCount, 'elements');
        }
        
        // Language switcher click handler
        $('.lang-btn, .lang-btn-inline').click(function(e) {
            e.preventDefault();
            const lang = $(this).data('lang');
            switchLanguage(lang);
        });
        
        // Load saved language preference on page load
        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        console.log('Loading saved language:', savedLang);
        switchLanguage(savedLang);

        /* ==================================================
            # Contact Form
         ===============================================*/
        $('.contact-form').submit(function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            this.reset();
        });

        /* ==================================================
            # Newsletter Form
         ===============================================*/
        $('.newsletter-form').submit(function(e) {
            e.preventDefault();
            
            // Get email
            const email = $(this).find('input[type="email"]').val();
            
            if (email) {
                alert('Thank you for subscribing to our newsletter!');
                $(this).find('input[type="email"]').val('');
            }
        });

        /* ==================================================
            # Navigation Menu
         ===============================================*/
        // Mobile menu toggle
        $('.navbar-toggle').click(function() {
            $(this).toggleClass('active');
            $('.navbar-collapse').toggleClass('in');
        });

        // Close mobile menu when clicking on links
        $('.navbar-nav a').click(function() {
            if ($(window).width() < 768) {
                $('.navbar-collapse').removeClass('in');
                $('.navbar-toggle').removeClass('active');
            }
        });

        /* ==================================================
            # Smooth Animations
         ===============================================*/
        // Add animation classes to elements when they come into view
        $(window).scroll(function() {
            $('.animate-on-scroll').each(function() {
                var elementTop = $(this).offset().top;
                var elementBottom = elementTop + $(this).outerHeight();
                var viewportTop = $(window).scrollTop();
                var viewportBottom = viewportTop + $(window).height();
                
                if (elementBottom > viewportTop && elementTop < viewportBottom) {
                    $(this).addClass('animated');
                }
            });
        });

        // Initialize animations on page load
        $('.animate-on-scroll').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animated');
            }
        });

        console.log('Rawabi Al Wasit website initialized successfully!');
    });

})(jQuery); // End jQuery

