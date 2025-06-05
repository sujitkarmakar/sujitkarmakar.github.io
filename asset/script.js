// Navbar Scroll Behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
        navbar.classList.add('hide');
    } else {
        navbar.classList.remove('hide');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true });

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Form Animation and Validation
const form = document.querySelector('.contact-form');
const inputs = form.querySelectorAll('input, textarea');

inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        alert('Sorry, there was a problem sending your message. Please try again later.');
        console.error('Form submission error:', error);
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Certification Slideshow
function initCertificationSlideshow() {
    const slides = document.querySelectorAll('.certification-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;
    const slideDelay = 5000; // 5 seconds between slides

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        stopSlideshow(); // Clear any existing interval
        slideInterval = setInterval(nextSlide, slideDelay);
    }

    function stopSlideshow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Initialize slideshow
    showSlide(currentSlide);
    startSlideshow();

    // Add event listeners for controls
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideshow(); // Restart the interval after manual navigation
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideshow(); // Restart the interval after manual navigation
        });
    }

    // Add click events for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            startSlideshow(); // Restart the interval after manual navigation
        });
    });

    // Pause slideshow on hover/touch
    const slideshow = document.querySelector('.certification-slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', stopSlideshow);
        slideshow.addEventListener('mouseleave', startSlideshow);
        slideshow.addEventListener('touchstart', stopSlideshow);
        slideshow.addEventListener('touchend', startSlideshow);
    }
}

// Initialize certification slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCertificationSlideshow();
});

// Project Pagination
document.addEventListener('DOMContentLoaded', function() {
    const pageButtons = document.querySelectorAll('.page-btn');
    const projectGrid = document.querySelector('.project-grid');
    const projectsPerPage = 6;
    const projects = Array.from(projectGrid.children);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    function showPage(pageNumber) {
        projects.forEach(project => project.style.display = 'none');
        const start = (pageNumber - 1) * projectsPerPage;
        const end = start + projectsPerPage;
        projects.slice(start, end).forEach(project => project.style.display = 'block');
        
        pageButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page == pageNumber) {
                btn.classList.add('active');
            }
        });
    }

    showPage(1);

    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            
            if (page === 'next') {
                const currentPage = document.querySelector('.page-btn.active').dataset.page;
                const nextPage = parseInt(currentPage) + 1;
                if (nextPage <= totalPages) {
                    showPage(nextPage);
                }
            } else {
                showPage(parseInt(page));
            }
        });
    });
});

// Add this to your existing JavaScript
document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = trigger.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const categoryDropdown = document.querySelector('.category-dropdown');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.display = 'block';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            // Close the dropdown after selection
            categoryDropdown.classList.remove('active');
        });
    });
});

// Category Dropdown Functionality
const categoryDropdown = document.querySelector('.category-dropdown');
const categoryLabel = document.querySelector('.category-label');

categoryLabel.addEventListener('click', () => {
    categoryDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove('active');
    }
});

// Service Slideshow Functionality
function initServiceSlideshows() {
    const slideshows = document.querySelectorAll('.service-slideshow');
    
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.service-slide');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // Start slideshow
        setInterval(nextSlide, 3000);
    });
}

// Initialize service slideshows when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initServiceSlideshows();
});

// Format project dates
function formatProjectDates() {
    const projectDates = document.querySelectorAll('.project-date');
    
    projectDates.forEach(dateElement => {
        const dateText = dateElement.textContent;
        const date = new Date(dateText);
        
        if (!isNaN(date.getTime())) {
            // Get month and take first 3 letters
            const month = date.toLocaleString('default', { month: 'long' }).substring(0, 3);
            const year = date.getFullYear();
            dateElement.textContent = `${month} ${year}`;
        }
    });
}

// Initialize date formatting when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    formatProjectDates();
    initCertificationSlideshow();
    initServiceSlideshows();
});

function getLikeKey(cardIndex) {
    return `project_like_${cardIndex}`;
}

function getLikeDateKey(cardIndex) {
    return `project_like_date_${cardIndex}`;
}

function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getInitialLike() {
    // Random number between 20 and 31
    return Math.floor(Math.random() * 12) + 20;
}

function updateProjectLikes() {
    document.querySelectorAll('.project-links').forEach((links, idx) => {
        // Remove Case Study button
        const caseBtn = Array.from(links.querySelectorAll('a')).find(a => a.textContent.trim().toLowerCase().includes('case study'));
        if (caseBtn) caseBtn.remove();
        // Remove any existing like count
        const oldLike = links.querySelector('.like-count');
        if (oldLike) oldLike.remove();
        // Like count logic
        const likeKey = getLikeKey(idx);
        const likeDateKey = getLikeDateKey(idx);
        let likeCount = parseInt(localStorage.getItem(likeKey), 10);
        let lastDate = localStorage.getItem(likeDateKey);
        const today = getTodayString();
        if (isNaN(likeCount)) {
            likeCount = getInitialLike();
            lastDate = today;
            localStorage.setItem(likeKey, likeCount);
            localStorage.setItem(likeDateKey, today);
        } else if (lastDate !== today) {
            // Increment by 1 for each day passed
            const last = new Date(lastDate);
            const now = new Date(today);
            const daysPassed = Math.floor((now - last) / (1000 * 60 * 60 * 24));
            if (daysPassed > 0) {
                likeCount += daysPassed;
                localStorage.setItem(likeKey, likeCount);
                localStorage.setItem(likeDateKey, today);
            }
        }
        // Add like count to the right
        const likeHTML = `<div class="like-count neumorphic"><i class="fas fa-heart"></i> <span>${likeCount}</span></div>`;
        links.insertAdjacentHTML('beforeend', likeHTML);
        links.style.justifyContent = 'space-between';
        links.style.alignItems = 'center';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateProjectLikes();
});

// Testimonial Slideshow
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
const prevTestimonialBtn = document.querySelector('.testimonial-controls .prev-btn');
const nextTestimonialBtn = document.querySelector('.testimonial-controls .next-btn');
let currentTestimonialSlide = 0;

function showTestimonialSlide(index) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialSlides[index].classList.add('active');
    testimonialDots[index].classList.add('active');
}

function nextTestimonialSlide() {
    currentTestimonialSlide = (currentTestimonialSlide + 1) % testimonialSlides.length;
    showTestimonialSlide(currentTestimonialSlide);
}

function prevTestimonialSlide() {
    currentTestimonialSlide = (currentTestimonialSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonialSlide(currentTestimonialSlide);
}

// Event listeners for testimonial controls
if (prevTestimonialBtn && nextTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', prevTestimonialSlide);
    nextTestimonialBtn.addEventListener('click', nextTestimonialSlide);
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonialSlide = index;
        showTestimonialSlide(currentTestimonialSlide);
    });
});

// Auto-advance testimonial slides
let testimonialInterval = setInterval(nextTestimonialSlide, 5000);

// Pause auto-advance on hover
const testimonialContainer = document.querySelector('.testimonials-container');
if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });

    testimonialContainer.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(nextTestimonialSlide, 5000);
    });
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Payment icon cycling for Flexible Payments
const paymentIcons = [
    'asset/btc.png',
    'asset/bhim.png',
    'asset/pi.png',
    'asset/pay.png',
    'asset/usdt.png'
];
let paymentIconIndex = 0;
const paymentImg = document.querySelector('.payment-cycle-icon');
if (paymentImg) {
    setInterval(() => {
        paymentIconIndex = (paymentIconIndex + 1) % paymentIcons.length;
        paymentImg.src = paymentIcons[paymentIconIndex];
    }, 2000);
}
