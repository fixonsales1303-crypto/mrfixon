// ===========================================
// Mr. Fixon - Advanced Animations
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    
    initScrollReveal();
    initTextAnimations();
    initHoverAnimations();
    initMagneticButtons();
    initSplitText();
    initMarquee();
    initCanvasEffects();
});

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate children
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        // Prepare children for animation
        const children = element.children;
        Array.from(children).forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'all 0.6s ease';
        });
        
        revealObserver.observe(element);
    });
}

/* ---------- Text Animations ---------- */
function initTextAnimations() {
    // Gradient shift on hover
    const gradientTexts = document.querySelectorAll('.text-gradient');
    
    gradientTexts.forEach(text => {
        text.addEventListener('mouseenter', () => {
            text.style.backgroundPosition = '100% 50%';
        });
        
        text.addEventListener('mouseleave', () => {
            text.style.backgroundPosition = '0% 50%';
        });
    });
    
    // Character animation
    const charAnimElements = document.querySelectorAll('.char-animation');
    
    charAnimElements.forEach(element => {
        const text = element.textContent;
        const chars = text.split('');
        
        element.innerHTML = '';
        
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.05}s`;
            span.classList.add('char');
            element.appendChild(span);
        });
    });
}

/* ---------- Hover Animations ---------- */
function initHoverAnimations() {
    // Card hover effects
    const cards = document.querySelectorAll('.product-card, .vertical-card, .feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Image zoom on hover
    const imageContainers = document.querySelectorAll('.image-zoom');
    
    imageContainers.forEach(container => {
        const img = container.querySelector('img');
        
        container.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
        });
        
        container.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
    
    // Link underline animation
    const links = document.querySelectorAll('.nav-link, .footer-links a');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const after = window.getComputedStyle(link, '::after');
            if (after) {
                link.style.setProperty('--underline-width', '100%');
            }
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.setProperty('--underline-width', '0%');
        });
    });
}

/* ---------- Magnetic Buttons ---------- */
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            button.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

/* ---------- Split Text ---------- */
function initSplitText() {
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = '';
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            wordSpan.style.animationDelay = `${wordIndex * 0.1}s`;
            
            const chars = word.split('');
            chars.forEach((char, charIndex) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.classList.add('char');
                charSpan.style.animationDelay = `${(wordIndex * 0.1) + (charIndex * 0.02)}s`;
                wordSpan.appendChild(charSpan);
            });
            
            element.appendChild(wordSpan);
            
            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    });
}

/* ---------- Marquee ---------- */
function initMarquee() {
    const marquees = document.querySelectorAll('.marquee');
    
    marquees.forEach(marquee => {
        const content = marquee.innerHTML;
        marquee.innerHTML = content + content;
        
        let speed = marquee.dataset.speed || 30;
        let direction = marquee.dataset.direction || 'left';
        
        let position = 0;
        
        function animateMarquee() {
            position -= direction === 'left' ? 1 : -1;
            
            if (direction === 'left') {
                if (Math.abs(position) >= marquee.scrollWidth / 2) {
                    position = 0;
                }
            } else {
                if (position >= 0) {
                    position = -marquee.scrollWidth / 2;
                }
            }
            
            marquee.style.transform = `translateX(${position}px)`;
            
            requestAnimationFrame(animateMarquee);
        }
        
        animateMarquee();
    });
}

/* ---------- Canvas Effects ---------- */
function initCanvasEffects() {
    const canvas = document.getElementById('canvas-effects');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    resize();
    
    window.addEventListener('resize', resize);
    
    // Particle system
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            color: `rgba(0, 180, 216, ${Math.random() * 0.3})`
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        // Draw connections
        ctx.strokeStyle = 'rgba(0, 180, 216, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 180, 216, ${0.1 * (1 - distance / 150)})`;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ---------- Parallax Mouse Effect ---------- */
function initParallaxMouse() {
    const parallaxElements = document.querySelectorAll('[data-parallax-mouse]');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/* ---------- Progress Bar Animation ---------- */
function initProgressBar() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const target = bar.dataset.target || 100;
                
                bar.style.setProperty('--target-width', target + '%');
                bar.classList.add('animate');
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

/* ---------- Number Counter ---------- */
function initNumberCounter() {
    const counters = document.querySelectorAll('.number-counter');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const step = 50;
                const increment = target / (duration / step);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        setTimeout(updateCounter, step);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}