// ==========================================
// EVOLUTION DANCE CENTRE - MAIN JAVASCRIPT
// ==========================================

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    
    if (navLinks && hamburger && !hamburger.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navLinksContainer = document.getElementById('navLinks');
            const hamburger = document.getElementById('hamburger');
            if (navLinksContainer && hamburger) {
                navLinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
});

// ==========================================
// VIDEO FILTERING FUNCTION
// ==========================================
function filterVideos(category) {
    const videos = document.querySelectorAll('.video-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter videos
    videos.forEach(video => {
        if (category === 'all' || video.dataset.category === category) {
            video.style.display = 'block';
        } else {
            video.style.display = 'none';
        }
    });
}

// ==========================================
// VIDEO PLAYER FUNCTIONS (For Portfolio)
// ==========================================

// Play video in fullscreen modal
function playVideo(videoPath, videoTitle) {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalVideoSource = document.getElementById('modalVideoSource');
    
    if (modal && modalVideo && modalVideoSource) {
        modalVideoSource.src = videoPath;
        modalVideo.load();
        modal.style.display = 'block';
        modalVideo.play();
    }
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (modal && modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside video
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target == modal) {
        closeVideoModal();
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeVideoModal();
    }
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ==========================================
// FORM VALIDATION (Contact Page)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Basic validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            if (name && name.value.trim() === '') {
                alert('Please enter your name');
                isValid = false;
            }
            
            if (email && email.value.trim() === '') {
                alert('Please enter your email');
                isValid = false;
            }
            
            if (subject && subject.value === '') {
                alert('Please select a subject');
                isValid = false;
            }
            
            if (message && message.value.trim() === '') {
                alert('Please enter a message');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});

// ==========================================
// LAZY LOADING FOR IMAGES
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ==========================================
// PREVENT VIDEO AUTOPLAY ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
    });
});

// ==========================================
// ACTIVE PAGE HIGHLIGHT IN NAVIGATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// CONSOLE WELCOME MESSAGE
// ==========================================
console.log('%c🎭 Evolution Dance Centre', 'color: #ff6b00; font-size: 24px; font-weight: bold;');
console.log('%cWebsite by Evolution Dance Centre', 'color: #ffa500; font-size: 14px;');
console.log('%cVisit us: E-100, Jeewan Park, Uttam Nagar, New Delhi', 'color: #999;');
