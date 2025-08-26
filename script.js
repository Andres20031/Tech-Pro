// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(251, 251, 253, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(251, 251, 253, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Product cards animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all product cards and features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    const animatedElements = document.querySelectorAll('.product-card, .feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Hero title typewriter effect
    const heroTitle = document.querySelector('.hero-title');
    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < titleText.length) {
            heroTitle.textContent += titleText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 500);
});

// Button hover effects and interactions
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-product, .btn-cta').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .btn-product, .btn-cta {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        animation: ripple-effect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-effect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Product showcase rotation
const productShowcase = document.querySelector('.product-showcase');
if (productShowcase) {
    let rotation = 0;
    setInterval(() => {
        rotation += 0.5;
        productShowcase.style.transform = `translateY(-20px) rotate(${Math.sin(rotation * 0.01) * 5}deg)`;
    }, 50);
}

// Counter animation for CTA section
const cta = document.querySelector('.cta');
let hasAnimated = false;

const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCounter();
        }
    });
}, { threshold: 0.5 });

if (cta) {
    ctaObserver.observe(cta);
}

function animateCounter() {
    const ctaText = document.querySelector('.cta p');
    if (ctaText) {
        let count = 0;
        const target = 1000000;
        const increment = target / 100;
        
        const counter = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(counter);
            }
            ctaText.textContent = `Más de ${Math.floor(count).toLocaleString()} usuarios ya confían en TechPro`;
        }, 30);
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Statistics counter animation
function initializeStatsCounters() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 40);
                
                statsObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(counter => {
        statsObserver.observe(counter);
    });
}

// Products carousel functionality
function initializeProductsCarousel() {
    const carousel = document.querySelector('.products-slider');
    const cards = document.querySelectorAll('.product-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carousel || cards.length === 0) return;

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 30; // including gap

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
        updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play carousel
    setInterval(nextSlide, 5000);
}

// Testimonials carousel
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (testimonials.length === 0) return;

    let currentTestimonial = 0;

    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => showTestimonial(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function showTestimonial(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(next);
    }

    // Auto-play testimonials
    setInterval(nextTestimonial, 6000);
}

// FAQ functionality
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Newsletter form functionality
function initializeNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const button = this.querySelector('.btn-subscribe');
        
        if (!email) return;

        // Simulate subscription
        const originalText = button.textContent;
        button.textContent = '¡Suscrito!';
        button.style.background = '#34c759';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'white';
            form.reset();
        }, 2000);
    });
}

// Enhanced scroll animations
function initializeScrollAnimations() {
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Special animation for feature cards
                if (entry.target.classList.contains('feature')) {
                    entry.target.style.animationDelay = `${Array.from(entry.target.parentElement.children).indexOf(entry.target) * 0.2}s`;
                    entry.target.style.animation = 'slideInUp 0.8s ease forwards';
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Animate elements on scroll
    const elementsToAnimate = document.querySelectorAll(`
        .stat-card,
        .feature,
        .testimonial-content,
        .faq-item,
        .newsletter-content,
        .cta-content
    `);

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        animateOnScroll.observe(el);
    });
}

// Particle system for hero
function initializeParticleSystem() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(102, 126, 234, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.zIndex = '-1';

        hero.appendChild(particle);

        // Animate particle
        const duration = 4000 + Math.random() * 2000;
        const startTime = performance.now();
        
        function animateParticle(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const y = 100 - (progress * 120);
            const x = parseFloat(particle.style.left) + (Math.sin(progress * 4) * 2);
            const opacity = Math.sin(progress * Math.PI);
            
            particle.style.transform = `translateY(-${y}vh) translateX(${x - parseFloat(particle.style.left)}vw)`;
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animateParticle);
        }
        
        requestAnimationFrame(animateParticle);
    }

    // Create particles periodically
    setInterval(createParticle, 300);
}

// Enhanced button interactions
function enhanceButtonInteractions() {
    document.querySelectorAll('.btn-cta-primary, .btn-cta-secondary, .btn-subscribe').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Smooth page transitions
function initializePageTransitions() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeStatsCounters();
    initializeProductsCarousel();
    initializeTestimonials();
    initializeFAQ();
    initializeNewsletter();
    initializeScrollAnimations();
    initializeParticleSystem();
    enhanceButtonInteractions();
    initializePageTransitions();
});

// Add CSS animations
const enhancedAnimationStyles = document.createElement('style');
enhancedAnimationStyles.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
    }
    
    /* Enhanced hover effects */
    .stat-card:hover .stat-icon {
        transform: scale(1.2);
        transition: transform 0.3s ease;
    }
    
    .feature:hover .feature-icon {
        animation: bounce 1s ease;
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(enhancedAnimationStyles);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});