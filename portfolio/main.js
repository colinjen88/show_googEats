/**
 * =============================================
 *  Good Eats | 優化版互動腳本
 *  Enhanced with micro-interactions
 * =============================================
 */

(function () {
  'use strict';

  // ===========================================
  // Utilities
  // ===========================================

  function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // ===========================================
  // Custom Cursor Module (放大鏡版本)
  // ===========================================
  const CustomCursor = {
    cursorDot: null,
    cursorOutline: null,
    mouseX: 0,
    mouseY: 0,
    outlineX: 0,
    outlineY: 0,
    rafId: null,
    isEnabled: false,

    init() {
      if (isTouchDevice()) {
        document.body.style.cursor = 'auto';
        return;
      }

      this.cursorDot = document.querySelector('.cursor-dot');
      this.cursorOutline = document.querySelector('.cursor-outline');

      if (!this.cursorDot || !this.cursorOutline) return;

      this.isEnabled = true;
      this.bindEvents();
      this.animate();
    },

    bindEvents() {
      document.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }, { passive: true });

      // 可點擊元素 hover 效果
      const clickables = document.querySelectorAll('a, button, [role="button"], .card-hover-effect, input, textarea');
      clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('hover-link');
        }, { passive: true });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('hover-link');
        }, { passive: true });
      });

      // 離開/進入視窗
      document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
          this.cursorDot.style.opacity = '0';
          this.cursorOutline.style.opacity = '0';
        }
      });

      document.addEventListener('mouseover', () => {
        this.cursorDot.style.opacity = '1';
        this.cursorOutline.style.opacity = '1';
      });
    },

    animate() {
      if (!this.isEnabled) return;

      // Dot 跟隨滑鼠
      this.cursorDot.style.left = `${this.mouseX}px`;
      this.cursorDot.style.top = `${this.mouseY}px`;

      // Outline 平滑跟隨
      this.outlineX = lerp(this.outlineX, this.mouseX, 0.12);
      this.outlineY = lerp(this.outlineY, this.mouseY, 0.12);

      this.cursorOutline.style.left = `${this.outlineX}px`;
      this.cursorOutline.style.top = `${this.outlineY}px`;

      this.rafId = requestAnimationFrame(() => this.animate());
    },

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
    }
  };

  // ===========================================
  // Split Pane Interaction
  // ===========================================
  const SplitPaneInteraction = {
    init() {
      const foodPane = document.querySelector('[data-side="food"]');
      const techPane = document.querySelector('[data-side="tech"]');

      if (!foodPane || !techPane) return;

      // Food Pane
      foodPane.addEventListener('mouseenter', () => {
        document.body.classList.add('hover-food');
        document.body.classList.remove('hover-link');
      }, { passive: true });
      foodPane.addEventListener('mouseleave', () => {
        document.body.classList.remove('hover-food');
      }, { passive: true });

      // Tech Pane
      techPane.addEventListener('mouseenter', () => {
        document.body.classList.add('hover-tech');
        document.body.classList.remove('hover-link');
      }, { passive: true });
      techPane.addEventListener('mouseleave', () => {
        document.body.classList.remove('hover-tech');
      }, { passive: true });
    }
  };

  // ===========================================
  // Scroll Reveal Animation
  // ===========================================
  const ScrollReveal = {
    observer: null,

    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback: 直接顯示所有元素
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
          el.classList.add('is-visible');
        });
        return;
      }

      const options = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        this.observer.observe(el);
      });
    }
  };

  // ===========================================
  // Magnetic Button Effect
  // ===========================================
  const MagneticButtons = {
    init() {
      if (isTouchDevice()) return;

      document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0, 0)';
        });
      });
    }
  };

  // ===========================================
  // Tilt Effect for Cards
  // ===========================================
  const TiltEffect = {
    init() {
      if (isTouchDevice()) return;

      document.querySelectorAll('.card-hover-effect').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;

          card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
      });
    }
  };

  // ===========================================
  // Smooth Scroll
  // ===========================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;

          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, targetId);
          }
        });
      });
    }
  };

  // ===========================================
  // Parallax Background
  // ===========================================
  const ParallaxBG = {
    init() {
      if (isTouchDevice()) return;

      const parallaxElements = document.querySelectorAll('.skew-bg-image');

      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(el => {
          const speed = 0.3;
          el.style.transform = `skewX(10deg) scale(1.1) translateY(${scrollY * speed}px)`;
        });
      }, { passive: true });
    }
  };

  // ===========================================
  // Counter Animation
  // ===========================================
  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    },

    animate(el) {
      const target = parseInt(el.dataset.count, 10);
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(update);
    }
  };

  // ===========================================
  // Typing Effect
  // ===========================================
  const TypingEffect = {
    init() {
      const typeElements = document.querySelectorAll('[data-type]');
      typeElements.forEach(el => {
        const text = el.dataset.type;
        const speed = parseInt(el.dataset.typeSpeed, 10) || 100;
        el.textContent = '';

        let i = 0;
        const type = () => {
          if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
          }
        };

        // Start when visible
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            type();
            observer.disconnect();
          }
        });
        observer.observe(el);
      });
    }
  };

  // ===========================================
  // Initialize
  // ===========================================
  function init() {
    CustomCursor.init();
    SplitPaneInteraction.init();
    ScrollReveal.init();
    MagneticButtons.init();
    TiltEffect.init();
    SmoothScroll.init();
    ParallaxBG.init();
    CounterAnimation.init();
    TypingEffect.init();

    // Add reveal classes to elements
    document.querySelectorAll('#stack .neo-glass').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    });

    document.querySelectorAll('#features .neo-glass').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    });

    document.querySelectorAll('#timeline article').forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.15}s`;
    });

    // Re-observe after adding classes
    ScrollReveal.init();
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('beforeunload', () => {
    CustomCursor.destroy();
  });

})();
