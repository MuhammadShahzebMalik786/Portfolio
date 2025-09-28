// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for anchor links
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

// Form submission handling - Remove preventDefault to allow Formspree
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Validate form
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const service = this.querySelector('select[name="service"]').value;
        const message = this.querySelector('textarea[name="message"]').value;
        
        if (!name || !email || !service || !message) {
            e.preventDefault();
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Form will submit to Formspree naturally
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(37, 99, 235, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
    }
});

// Animate elements on scroll
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-category, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Portfolio filter functionality
const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        portfolioFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        const filterValue = filter.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });
    });
});

// Testimonial slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
    });
}

if (testimonials.length > 0) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    showTestimonial(0);
}

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for better mobile experience
const style = document.createElement('style');
style.textContent = `
    .navbar {
        transition: background 0.3s ease, backdrop-filter 0.3s ease;
    }
    
    .nav-menu a.active {
        color: #fbbf24 !important;
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .nav-container {
            justify-content: space-between;
            align-items: center;
        }
    }
`;
document.head.appendChild(style);
