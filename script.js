/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - SIMRAN SHARIFF
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PRELOADER & INITIALIZATION
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', () => {
        // Fade out preloader
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Trigger AOS animations after page is visible
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 800,
                        easing: 'ease-in-out',
                        once: true,
                        mirror: false
                    });
                }
            }, 500);
        }
    });

    /* ==========================================================================
       2. CUSTOM INTERACTIVE DUAL-RING CURSOR
       ========================================================================== */
    const cursorOutline = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    let mouseX = 0, mouseY = 0; // Current mouse positions
    let outlineX = 0, outlineY = 0; // Lagging outline positions
    
    // Smooth lerp (linear interpolation) speed for the cursor outline
    const cursorOutlineSpeed = 0.15;
    let cursorVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements on first movement
        if (!cursorVisible) {
            cursorOutline.style.opacity = '1';
            cursorDot.style.opacity = '1';
            cursorVisible = true;
        }
        
        // Dot follows cursor directly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Animate outline cursor with lerp lag
    function animateCursor() {
        if (cursorVisible) {
            outlineX += (mouseX - outlineX) * cursorOutlineSpeed;
            outlineY += (mouseY - outlineY) * cursorOutlineSpeed;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide custom cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorOutline.style.opacity = '0';
        cursorDot.style.opacity = '0';
        cursorVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        cursorOutline.style.opacity = '1';
        cursorDot.style.opacity = '1';
        cursorVisible = true;
    });

    // Expand cursor on hovering interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .tool-tag');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovered');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovered');
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    /* ==========================================================================
       3. HIGH-PERFORMANCE DYNAMIC CANVAS PARTICLES
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let numberOfParticles = 80;
        
        // Match canvas size to screen
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Adjust density for mobile screens
            if (window.innerWidth < 768) {
                numberOfParticles = 35;
            } else {
                numberOfParticles = 80;
            }
            initParticles();
        }
        
        // Define Particle class
        class Particle {
            constructor(x, y) {
                this.x = x || Math.random() * canvas.width;
                this.y = y || Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Particle diameter
                this.speedX = Math.random() * 0.4 - 0.2; // Slow floating speeds
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = Math.random() > 0.5 ? 'rgba(0, 210, 255, 0.4)' : 'rgba(112, 0, 255, 0.4)'; // Cyan/Purple
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Keep inside screen boundaries
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize particle array
        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        // Draw links between nearby particles
        function connectParticles() {
            let maxDistance = 110;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a + 1; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        // Fade connection lines as particles drift further apart
                        let opacityValue = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(0, 210, 255, ${opacityValue * 0.08})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Infinite Animation Loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }

    /* ==========================================================================
       4. ANIMATED TYPING EFFECT
       ========================================================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const words = ["AI Student", "Future Data Scientist", "Machine Learning Enthusiast", "Python Developer"];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newWordDelay = 2000; // Delay before erasing word
    let wordIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < words[wordIndex].length) {
            typedTextSpan.textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = words[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        }
    }
    
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       5. RESPONSIVE MOBILE NAVIGATION MENU
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Add border/blur to header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       6. ACTIVE NAVIGATION LINK ON SCROLL HIGHLIGHT
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveNavLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Highlight triggers slightly ahead of scroll entering section midpoint
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', highlightActiveNavLink);

    /* ==========================================================================
       7. SCROLL-TO-TOP BUTTON
       ========================================================================== */
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       8. SKILLS PROGRESS FILL ON INTERSECTION
       ========================================================================== */
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');
    
    if (skillsSection && progressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger progressive width load
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                    // Stop observing once animated
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       9. 3D GLOW TILT ACTION (ACHIEVEMENT CARDS)
       ========================================================================== */
    const cards = document.querySelectorAll('.achievement-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate hover coordinates relative to the card bounds
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set css properties for the glowing background circle position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ==========================================================================
       10. MOCK CONTACT FORM SUBMISSION WITH INTERACTION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    
    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Fetch values
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;
            
            // Simple validation check
            if (!name || !email || !message) return;
            
            // Show loading state on submit button
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            // Simulate API request processing
            setTimeout(() => {
                // Hide contact form with smooth fade
                contactForm.style.opacity = '0';
                
                setTimeout(() => {
                    contactForm.classList.add('hidden');
                    // Show success feedback
                    formFeedback.classList.remove('hidden');
                }, 300);
            }, 1500);
        });
    }

});
