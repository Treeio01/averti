let observer = null;
let initialized = false;

const animationConfigs = {
    'fade-up': {
        initial: { opacity: 0, transform: 'translateY(30px)' },
        animate: { opacity: 1, transform: 'translateY(0)' }
    },
    'fade-down': {
        initial: { opacity: 0, transform: 'translateY(-30px)' },
        animate: { opacity: 1, transform: 'translateY(0)' }
    },
    'fade-left': {
        initial: { opacity: 0, transform: 'translateX(30px)' },
        animate: { opacity: 1, transform: 'translateX(0)' }
    },
    'fade-right': {
        initial: { opacity: 0, transform: 'translateX(-30px)' },
        animate: { opacity: 1, transform: 'translateX(0)' }
    },
    'zoom-in': {
        initial: { opacity: 0, transform: 'scale(0.8)' },
        animate: { opacity: 1, transform: 'scale(1)' }
    },
    'zoom-out': {
        initial: { opacity: 0, transform: 'scale(1.2)' },
        animate: { opacity: 1, transform: 'scale(1)' }
    },
    'slide-up': {
        initial: { opacity: 0, transform: 'translateY(50px)' },
        animate: { opacity: 1, transform: 'translateY(0)' }
    },
    'fade': {
        initial: { opacity: 0 },
        animate: { opacity: 1 }
    },
    'scale-up': {
        initial: { opacity: 0, transform: 'scale(0.9)' },
        animate: { opacity: 1, transform: 'scale(1)' }
    },
    'slide-in-left': {
        initial: { opacity: 0, transform: 'translateX(-60px)' },
        animate: { opacity: 1, transform: 'translateX(0)' }
    },
    'slide-in-right': {
        initial: { opacity: 0, transform: 'translateX(60px)' },
        animate: { opacity: 1, transform: 'translateX(0)' }
    },
    'blur-fade': {
        initial: { opacity: 0, filter: 'blur(10px)' },
        animate: { opacity: 1, filter: 'blur(0px)' }
    },
    'blur-scale': {
        initial: { opacity: 0, filter: 'blur(12px)', transform: 'scale(0.92)' },
        animate: { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' }
    },
    'reveal-up': {
        initial: { opacity: 0, transform: 'translateY(80px)' },
        animate: { opacity: 1, transform: 'translateY(0)' }
    },
    'tilt-in': {
        initial: { opacity: 0, transform: 'perspective(800px) rotateX(8deg) translateY(30px)' },
        animate: { opacity: 1, transform: 'perspective(800px) rotateX(0deg) translateY(0)' }
    },
    'float-up': {
        initial: { opacity: 0, transform: 'translateY(60px) scale(0.95)' },
        animate: { opacity: 1, transform: 'translateY(0) scale(1)' }
    },
    'slide-in-left-blur': {
        initial: { opacity: 0, transform: 'translateX(-40px)', filter: 'blur(6px)' },
        animate: { opacity: 1, transform: 'translateX(0)', filter: 'blur(0px)' }
    },
    'slide-in-right-blur': {
        initial: { opacity: 0, transform: 'translateX(40px)', filter: 'blur(6px)' },
        animate: { opacity: 1, transform: 'translateX(0)', filter: 'blur(0px)' }
    },
    'arc-rotate-right': {
        initial: { opacity: 0, transform: 'translateX(-50%) rotate(180deg)' },
        animate: { opacity: 1, transform: 'translateX(-50%) rotate(0deg)' }
    },
    'arc-rotate-left': {
        initial: { opacity: 0, transform: 'translateX(-50%) rotate(-180deg)' },
        animate: { opacity: 1, transform: 'translateX(-50%) rotate(0deg)' }
    }
};

const BLUR_ANIMATIONS = ['blur-fade', 'blur-scale', 'slide-in-left-blur', 'slide-in-right-blur'];
const TRANSFORM_KEEP_ANIMATIONS = ['arc-rotate-right', 'arc-rotate-left'];

function initScrollAnimations() {
    if (typeof window === 'undefined' || initialized) return;

    if (!document.getElementById('scroll-animations-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations-style';
        style.textContent = `
            [data-scroll-animate] {
                transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                            filter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                will-change: opacity, transform, filter;
            }
            [data-scroll-animate="arc-rotate-right"],
            [data-scroll-animate="arc-rotate-left"] {
                transform-origin: center bottom;
            }
            [data-scroll-animate="tilt-in"] {
                transform-origin: center bottom;
            }
        `;
        document.head.appendChild(style);
    }

    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const type = el.getAttribute('data-scroll-animate');
                        const delay = parseInt(el.getAttribute('data-scroll-delay') || '0');
                        const duration = parseFloat(el.getAttribute('data-scroll-duration') || '0.6');
                        const config = animationConfigs[type];

                        setTimeout(() => {
                            el.style.transitionDuration = `${duration}s`;

                            if (config?.animate) {
                                Object.entries(config.animate).forEach(([prop, val]) => {
                                    el.style[prop] = val;
                                });
                            }

                            el.classList.add('scroll-animated');
                        }, delay);

                        observer.unobserve(el);
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.05
            }
        );

        initialized = true;
    }
}

function applyInitialStyles() {
    if (typeof window === 'undefined') return;

    const elements = document.querySelectorAll('[data-scroll-animate]');
    elements.forEach((el) => {
        const type = el.getAttribute('data-scroll-animate');
        const config = animationConfigs[type];

        if (config && !el.classList.contains('scroll-animated')) {
            Object.entries(config.initial).forEach(([prop, val]) => {
                el.style[prop] = val;
            });
        }
    });
}

function observeElements() {
    if (!observer || typeof window === 'undefined') return;

    const elements = document.querySelectorAll('[data-scroll-animate]:not(.scroll-animated)');
    elements.forEach((el) => {
        observer.observe(el);
    });
}

export function initScrollAnimationsSystem() {
    if (typeof window === 'undefined') return;
    initScrollAnimations();
    applyInitialStyles();
    requestAnimationFrame(() => {
        observeElements();
    });
}

export function refreshScrollAnimations() {
    if (typeof window === 'undefined') return;
    applyInitialStyles();
    observeElements();
}
