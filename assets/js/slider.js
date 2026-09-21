// ===========================================
// Mr. Fixon - Slider Configurations
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    
    initTestimonialSlider();
    initProductSlider();
    initPartnerSlider();
    initGallerySlider();
    initBeforeAfterSlider();
});

/* ---------- Testimonial Slider ---------- */
function initTestimonialSlider() {
    const testimonialSwiper = document.querySelector('.testimonialSwiper');
    
    if (!testimonialSwiper || typeof Swiper === 'undefined') return;
    
    new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
        },
        on: {
            init: function () {
                console.log('Testimonial slider initialized');
            },
        },
    });
}

/* ---------- Product Slider ---------- */
function initProductSlider() {
    const productSwiper = document.querySelector('.productSwiper');
    
    if (!productSwiper || typeof Swiper === 'undefined') return;
    
    new Swiper('.productSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 4,
            },
        },
        effect: 'slide',
        speed: 800,
        parallax: true,
    });
}

/* ---------- Partner Slider ---------- */
function initPartnerSlider() {
    const partnerSwiper = document.querySelector('.partnerSwiper');
    
    if (!partnerSwiper || typeof Swiper === 'undefined') return;
    
    new Swiper('.partnerSwiper', {
        slidesPerView: 2,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            480: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            1024: {
                slidesPerView: 5,
            },
        },
        speed: 5000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        freeMode: true,
        freeModeMomentum: false,
        slidesPerView: 'auto',
        loop: true,
    });
}

/* ---------- Gallery Slider ---------- */
function initGallerySlider() {
    const gallerySwiper = document.querySelector('.gallerySwiper');
    
    if (!gallerySwiper || typeof Swiper === 'undefined') return;
    
    new Swiper('.gallerySwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
        effect: 'creative',
        creativeEffect: {
            prev: {
                shadow: true,
                translate: [0, 0, -400],
            },
            next: {
                translate: ['100%', 0, 0],
            },
        },
    });
}

/* ---------- Before/After Slider ---------- */
function initBeforeAfterSlider() {
    const beforeAfterSliders = document.querySelectorAll('.before-after-slider');
    
    if (beforeAfterSliders.length === 0) return;
    
    beforeAfterSliders.forEach(slider => {
        const container = slider.querySelector('.before-after-container');
        const before = slider.querySelector('.before');
        const after = slider.querySelector('.after');
        const handle = slider.querySelector('.slider-handle');
        
        if (!container || !before || !after || !handle) return;
        
        let isDragging = false;
        
        const updateSlider = (x) => {
            const rect = container.getBoundingClientRect();
            let position = (x - rect.left) / rect.width;
            
            position = Math.max(0, Math.min(1, position));
            
            before.style.width = `${position * 100}%`;
            handle.style.left = `${position * 100}%`;
        };
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        container.addEventListener('click', (e) => {
            updateSlider(e.clientX);
        });
        
        // Touch events
        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    });
}

/* ---------- Custom Slider Navigation ---------- */
function initSliderNavigation() {
    const sliders = document.querySelectorAll('[data-slider]');
    
    sliders.forEach(slider => {
        const next = slider.querySelector('[data-slider-next]');
        const prev = slider.querySelector('[data-slider-prev]');
        const slides = slider.querySelectorAll('[data-slide]');
        let currentIndex = 0;
        
        if (!next || !prev || slides.length === 0) return;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        };
        
        next.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });
        
        prev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });
        
        showSlide(0);
    });
}

/* ---------- Auto Play Slider ---------- */
function initAutoPlaySlider() {
    const autoSliders = document.querySelectorAll('[data-autoplay]');
    
    autoSliders.forEach(slider => {
        const slides = slider.querySelectorAll('[data-slide]');
        const interval = parseInt(slider.dataset.interval) || 3000;
        let currentIndex = 0;
        
        if (slides.length === 0) return;
        
        const showNextSlide = () => {
            slides.forEach(slide => slide.classList.remove('active'));
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        };
        
        setInterval(showNextSlide, interval);
    });
}