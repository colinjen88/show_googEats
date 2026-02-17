
document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor Logic (Fix: Track mouse movement) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // IMPORTANT: Check if elements exist before proceeding
    if (cursorDot && cursorOutline) {
        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows immediately
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Loop for smoother outline delay
        const animateCursor = () => {
             // Linear interpolation for smooth delay effect
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);
        
        // --- Hover Effects Handling ---
        // We use classes on body to easily change cursor style globally
        const handleHover = (selector, className) => {
             document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add(className));
                el.addEventListener('mouseleave', () => document.body.classList.remove(className));
            });
        };
        
        // Links and Buttons
        handleHover('a, button, [role="button"]', 'hover-link');
        
        // Split Panes (Food vs Tech)
        // Note: Using attributes to target specific panes
        const foodPane = document.querySelector('[data-side="food"]');
        const techPane = document.querySelector('[data-side="tech"]');
        
        if (foodPane) {
            foodPane.addEventListener('mouseenter', () => document.body.classList.add('hover-food'));
            foodPane.addEventListener('mouseleave', () => document.body.classList.remove('hover-food'));
        }
        
        if (techPane) {
            techPane.addEventListener('mouseenter', () => document.body.classList.add('hover-tech'));
            techPane.addEventListener('mouseleave', () => document.body.classList.remove('hover-tech'));
        }
    }


    // --- Admin Dashboard Slider ---
    const sliderContainer = document.getElementById('admin-slider');
    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll('img.slide'); // Be specific
        let currentIndex = 0;
        const totalSlides = slides.length;
        const intervalTime = 4000;

        // Initialize
        slides.forEach((slide, index) => {
            // Force object-cover via JS if CSS fails, though CSS is better
            slide.style.objectFit = 'cover'; 
            slide.style.objectPosition = 'top';
            
            slide.classList.remove('translate-x-0', '-translate-x-full', 'translate-x-full', 'transition-transform', 'duration-1000');
            slide.classList.add('transition-transform', 'duration-1000', 'ease-in-out');
            
            // Ensure proper stacking context just in case
            slide.style.zIndex = '10';

            if (index === 0) {
                slide.classList.add('translate-x-0');
                slide.style.zIndex = '20'; // Current on top initially
            } else {
                slide.classList.add('translate-x-full');
            }
        });

        console.log(`Admin Slider Initialized: ${totalSlides} slides found.`);

        const nextSlide = () => {
            const currentSlide = slides[currentIndex];
            const nextIndex = (currentIndex + 1) % totalSlides;
            const nextSlideEl = slides[nextIndex];

            // Debug
            console.log(`Transition: ${currentIndex} -> ${nextIndex}`);

            // 0. Setup Steps (Ensure starting positions)
            // Ensure Next slide is definitely on the right and ready
            // We temporarily disable transition to force it to start position if it wasn't there
            if (!nextSlideEl.classList.contains('translate-x-full')) {
                nextSlideEl.classList.remove('transition-transform', 'duration-1000', 'ease-in-out');
                nextSlideEl.classList.remove('translate-x-0', '-translate-x-full');
                nextSlideEl.classList.add('translate-x-full');
                void nextSlideEl.offsetWidth; // Apply
                nextSlideEl.classList.add('transition-transform', 'duration-1000', 'ease-in-out');
            }

            // 1. Trigger Animation
            // Move Current Left
            currentSlide.style.zIndex = '10'; // Move to back so Next can slide OVER it if needed? No, side by side.
            currentSlide.classList.remove('translate-x-0');
            currentSlide.classList.add('-translate-x-full');

            // Move Next Center
            nextSlideEl.style.zIndex = '20'; // Bring to front
            nextSlideEl.classList.remove('translate-x-full');
            nextSlideEl.classList.add('translate-x-0');

            // 2. Cleanup Old Slide
            setTimeout(() => {
                // Disable transition
                currentSlide.classList.remove('transition-transform', 'duration-1000', 'ease-in-out');
                
                // Teleport to Right
                currentSlide.classList.remove('-translate-x-full');
                currentSlide.classList.add('translate-x-full');
                
                // Force Reflow
                void currentSlide.offsetWidth;
                
                // Re-enable transition
                currentSlide.classList.add('transition-transform', 'duration-1000', 'ease-in-out');
                
                currentSlide.style.zIndex = '10';
            }, 1000); // 1s matches duration

            currentIndex = nextIndex;
        };

        setInterval(nextSlide, intervalTime);
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll to Top Button Visibility ---
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDropdown = document.getElementById('mobile-nav-dropdown');
    
    if (mobileMenuBtn && mobileDropdown) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileDropdown.classList.toggle('hidden');
        });
    }
});
