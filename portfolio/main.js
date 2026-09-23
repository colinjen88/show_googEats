
document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor Logic (Only on devices with fine pointer / mouse) ---
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (hasFinePointer && cursorDot && cursorOutline) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let cursorFrame = null;

        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows immediately
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            if (cursorFrame === null) cursorFrame = requestAnimationFrame(animateCursor);
        }, { passive: true });

        // Only animate while the outline is catching up with the pointer.
        const animateCursor = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            
            if (Math.abs(mouseX - outlineX) + Math.abs(mouseY - outlineY) > 0.5) {
                cursorFrame = requestAnimationFrame(animateCursor);
            } else {
                cursorFrame = null;
            }
        };
        
        // --- Hover Effects Handling ---
        const handleHover = (selector, className) => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add(className), { passive: true });
                el.addEventListener('mouseleave', () => document.body.classList.remove(className), { passive: true });
            });
        };
        
        // Links and Buttons
        handleHover('a, button, [role="button"]', 'hover-link');
        
        // Split Panes (Food vs Tech)
        const foodPane = document.querySelector('[data-side="food"]');
        const techPane = document.querySelector('[data-side="tech"]');
        
        if (foodPane) {
            foodPane.addEventListener('mouseenter', () => document.body.classList.add('hover-food'), { passive: true });
            foodPane.addEventListener('mouseleave', () => document.body.classList.remove('hover-food'), { passive: true });
        }
        
        if (techPane) {
            techPane.addEventListener('mouseenter', () => document.body.classList.add('hover-tech'), { passive: true });
            techPane.addEventListener('mouseleave', () => document.body.classList.remove('hover-tech'), { passive: true });
        }
    }

    // --- Admin Dashboard Slider ---
    const sliderContainer = document.getElementById('admin-slider');
    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll('img.slide');
        let currentIndex = 0;
        const totalSlides = slides.length;
        const intervalTime = 4000;
        let sliderTimer = null;

        const nextSlide = () => {
            const currentSlide = slides[currentIndex];
            const nextIndex = (currentIndex + 1) % totalSlides;
            const nextSlideEl = slides[nextIndex];
            nextSlideEl.style.zIndex = '20';
            currentSlide.style.zIndex = '10';
            nextSlideEl.classList.replace('translate-x-full', 'translate-x-0');
            currentSlide.classList.replace('translate-x-0', '-translate-x-full');

            currentSlide.addEventListener('transitionend', (event) => {
                if (event.target !== currentSlide || event.propertyName !== 'transform') return;
                currentSlide.classList.remove('transition-transform', 'duration-1000', 'ease-in-out');
                currentSlide.classList.replace('-translate-x-full', 'translate-x-full');
                requestAnimationFrame(() => {
                    currentSlide.classList.add('transition-transform', 'duration-1000', 'ease-in-out');
                });
            }, { once: true });

            currentIndex = nextIndex;
        };

        const startSlider = () => {
            if (!sliderTimer) sliderTimer = setInterval(nextSlide, intervalTime);
        };

        const stopSlider = () => {
            if (sliderTimer) {
                clearInterval(sliderTimer);
                sliderTimer = null;
            }
        };

        // Pause slider when out of viewport to save CPU / battery
        if (totalSlides > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startSlider();
                    } else {
                        stopSlider();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(sliderContainer);
        } else if (totalSlides > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            startSlider();
        }
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
        }, { passive: true });

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
            mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
            mobileDropdown.classList.toggle('is-open', !isExpanded);
        });
        mobileDropdown.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileDropdown.classList.remove('is-open');
            }
        });
    }
});
