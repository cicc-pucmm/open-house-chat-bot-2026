/**
 * Mouse Effects for OpenHouse ICC Chatbot
 * Subtle, performant mouse interactions
 */

// Configuration
const CONFIG = {
    spotlight: {
        enabled: true,
        size: 400,
        opacity: 0.08
    },
    parallax: {
        enabled: true,
        intensity: 0.02
    },
    tilt: {
        enabled: false,
        maxAngle: 2,
        scale: 1.01
    }
};

// State
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let rafId = null;

/**
 * Initialize mouse effects
 */
function initMouseEffects() {
    // Create spotlight element
    if (CONFIG.spotlight.enabled) {
        createSpotlight();
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initialize tilt effects on cards
    if (CONFIG.tilt.enabled) {
        initTiltEffects();
    }

    // Start animation loop
    animate();
}

/**
 * Create the spotlight overlay
 */
function createSpotlight() {
    const spotlight = document.createElement('div');
    spotlight.id = 'mouse-spotlight';
    spotlight.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${CONFIG.spotlight.size}px;
        height: ${CONFIG.spotlight.size}px;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translate(-50%, -50%);
        will-change: transform, opacity;
    `;
    document.body.appendChild(spotlight);
    updateSpotlightStyle();
}

/**
 * Update spotlight style based on theme
 */
function updateSpotlightStyle() {
    const spotlight = document.getElementById('mouse-spotlight');
    if (!spotlight) return;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    if (isLight) {
        spotlight.style.background = `radial-gradient(circle, rgba(59, 130, 246, ${CONFIG.spotlight.opacity}) 0%, transparent 70%)`;
    } else {
        spotlight.style.background = `radial-gradient(circle, rgba(139, 92, 246, ${CONFIG.spotlight.opacity * 1.5}) 0%, transparent 70%)`;
    }
}

/**
 * Handle mouse movement
 */
function handleMouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;

    // Show spotlight
    const spotlight = document.getElementById('mouse-spotlight');
    if (spotlight) {
        spotlight.style.opacity = '1';
    }
}

/**
 * Handle mouse leaving the window
 */
function handleMouseLeave() {
    const spotlight = document.getElementById('mouse-spotlight');
    if (spotlight) {
        spotlight.style.opacity = '0';
    }
}

/**
 * Animation loop with lerp for smooth movement
 */
function animate() {
    // Smooth interpolation
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;

    // Update spotlight position
    const spotlight = document.getElementById('mouse-spotlight');
    if (spotlight) {
        spotlight.style.transform = `translate(${mouseX - CONFIG.spotlight.size / 2}px, ${mouseY - CONFIG.spotlight.size / 2}px)`;
    }

    // Update parallax on background blobs
    if (CONFIG.parallax.enabled) {
        updateParallax();
    }

    rafId = requestAnimationFrame(animate);
}

/**
 * Update parallax effect on background elements
 */
function updateParallax() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = (mouseX - centerX) * CONFIG.parallax.intensity;
    const deltaY = (mouseY - centerY) * CONFIG.parallax.intensity;

    // Get all floating blobs (the colored circles in the background)
    const darkBg = document.querySelector('.bg-dark-theme');
    const lightBg = document.querySelector('.bg-light-theme');

    [darkBg, lightBg].forEach(bg => {
        if (!bg) return;
        const blobs = bg.querySelectorAll('.animate-float');
        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 0.5;
            const x = deltaX * factor;
            const y = deltaY * factor;
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/**
 * Initialize tilt effects on interactive cards
 */
function initTiltEffects() {
    const tiltElements = document.querySelectorAll('.header-card, .chat-card, .input-card');

    tiltElements.forEach(element => {
        element.style.transition = 'transform 0.2s ease-out';
        element.style.transformStyle = 'preserve-3d';

        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.1s ease-out';
        });

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            const rotateX = deltaY * -CONFIG.tilt.maxAngle;
            const rotateY = deltaX * CONFIG.tilt.maxAngle;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${CONFIG.tilt.scale})`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transition = 'transform 0.3s ease-out';
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

/**
 * Add ripple effect to buttons
 */
function addRippleEffect() {
    const buttons = document.querySelectorAll('.send-btn, .suggestion-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Watch for theme changes to update spotlight
 */
function watchThemeChanges() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateSpotlightStyle();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

/**
 * Cleanup function
 */
function destroyMouseEffects() {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
    const spotlight = document.getElementById('mouse-spotlight');
    if (spotlight) {
        spotlight.remove();
    }
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseLeave);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMouseEffects();
        addRippleEffect();
        watchThemeChanges();
    });
} else {
    initMouseEffects();
    addRippleEffect();
    watchThemeChanges();
}

// Expose for potential manual control
window.mouseEffects = {
    destroy: destroyMouseEffects,
    config: CONFIG
};
