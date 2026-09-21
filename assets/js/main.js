// ===========================================
// Mr. Fixon - Main JavaScript
// ===========================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    
    // Initialize all modules
    initLoader();
    initCursor();
    initNavbar();
    initMobileMenu();
    initParticles();
    initLenis();
    initBackToTop();
    initRippleEffect();
    initImageParallax();
    initCounters();
    initGSAPAnimations();
    initActiveLinks();
});

/* ---------- Loading Screen ---------- */
/* ---------- Updated Loading Screen (1.5 seconds) ---------- */
function initLoader() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) return;
    
    // Hide loading screen after exactly 1.5 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Optional: Remove loading screen from DOM after animation
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.style.display = 'none';
            }
        }, 500); // Wait for fade out animation
    }, 1500); // 1.5 seconds
    
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
    
    // Optional: Add a subtle animation to the logo
    const logo = document.querySelector('.logo-image');
    if (logo) {
        logo.style.animation = 'fadeInScale 1.5s ease forwards';
    }
}

/* ---------- Custom Cursor ---------- */
function initCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-outline, .product-card, .vertical-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

/* ---------- Navbar Scroll Effect ---------- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-links a');
    
    if (!menuToggle || !mobileMenu) return;
    
    const openMenu = () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeMenuFunc = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    menuToggle.addEventListener('click', openMenu);
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuFunc);
    }
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenuFunc);
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenuFunc();
        }
    });
}

/* ---------- Particles.js ---------- */
function initParticles() {
    if (typeof particlesJS === 'undefined' || !document.getElementById('particles-js')) return;
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#00b4d8'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.2,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00b4d8',
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.3
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

/* ---------- Lenis Smooth Scroll ---------- */
function initLenis() {
    if (typeof Lenis === 'undefined') return;
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            
            if (target) {
                lenis.scrollTo(target, {
                    offset: 0,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });
}

/* ---------- Back to Top Button ---------- */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, {
                duration: 1.5
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

/* ---------- Ripple Effect ---------- */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-glow');
    
    buttons.forEach(button => {
        button.classList.add('ripple');
        
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            const existingRipple = button.querySelector('.ripple-effect');
            if (existingRipple) {
                existingRipple.remove();
            }
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ---------- Image Parallax ---------- */
function initImageParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-image');
    
    if (parallaxImages.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxImages.forEach(image => {
            const speed = image.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            image.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* ---------- Counters Animation ---------- */
function initCounters() {
    const counters = document.querySelectorAll('.counter-number .counter');
    
    if (counters.length === 0) return;
    
    const counterSection = document.querySelector('.stats-section');
    
    if (!counterSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(counterSection);
    
    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = 50;
            const increment = target / (duration / step);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                
                if (current < target) {
                    counter.textContent = Math.ceil(current) + '+';
                    setTimeout(updateCounter, step);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
    }
}

/* ---------- GSAP Animations ---------- */
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.from('.hero-title', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-description', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.6,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-buttons', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.9,
        ease: 'power3.out'
    });
    
    // Scroll-triggered animations
    gsap.utils.toArray('.fade-up').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Stagger animations
    gsap.utils.toArray('.stagger-item').forEach((element, index) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element.parentElement,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
    
    // Parallax effect
    gsap.utils.toArray('.parallax-section').forEach(section => {
        const depth = section.dataset.depth || 200;
        
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: depth,
            ease: 'none'
        });
    });
    
    // Horizontal scroll timeline
    const timelineSection = document.querySelector('.process-timeline');
    
    if (timelineSection) {
        gsap.from('.process-step', {
            scrollTrigger: {
                trigger: timelineSection,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1
            },
            opacity: 0,
            scale: 0.8,
            stagger: 0.2
        });
    }
}

/* ---------- Typed.js ---------- */
function initTyped() {
    if (typeof Typed === 'undefined' || !document.getElementById('typed-text')) return;
    
    new Typed('#typed-text', {
        strings: [
            'LED Displays for Every Need',
            'Custom Acrylic Products',
            'Premium Glass Whiteboards',
            'Digital Signage Solutions',
            'Your Corporate Search Ends Here'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

/* ---------- Vanilla Tilt ---------- */
function initVanillaTilt() {
    if (typeof VanillaTilt === 'undefined') return;
    
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        scale: 1.02,
        perspective: 1000,
        easing: 'cubic-bezier(.03,.98,.52,.99)'
    });
}

/* ---------- AOS ---------- */
function initAOS() {
    if (typeof AOS === 'undefined') return;
    
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        offset: 50,
        delay: 100,
        easing: 'ease-in-out'
    });
}

/* ---------- Lazy Loading ---------- */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ---------- Active Link Highlighting ---------- */
function initActiveLinks() {
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }
    
    const allNavLinks = document.querySelectorAll('.nav-menu a, .mobile-menu-links a, .nav-link');
    
    allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;
        const linkPage = linkHref.split('/').pop().split('?')[0].split('#')[0];
        
        if (linkPage === currentPage || (currentPage === 'index.html' && (linkPage === '' || linkPage === 'index.html' || linkHref === '/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}