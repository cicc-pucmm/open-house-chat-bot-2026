/**
 * Theme Management for OpenHouse ICC Chatbot
 * Handles light/dark theme switching with smooth transitions
 */

// Theme constants
const THEME_KEY = 'openhouse-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

/**
 * Initialize theme on page load
 */
function initializeTheme() {
    // Check for saved preference, default to light for the event
    const savedTheme = localStorage.getItem(THEME_KEY) || LIGHT_THEME;
    setTheme(savedTheme, false);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme, true);
}

/**
 * Set the theme
 * @param {string} theme - 'light' or 'dark'
 * @param {boolean} animate - whether to animate the transition
 */
function setTheme(theme, animate = true) {
    const html = document.documentElement;

    if (animate) {
        // Add transition class for smooth animation
        html.style.setProperty('--theme-transition', '0.5s');
    } else {
        html.style.setProperty('--theme-transition', '0s');
    }

    // Set the theme attribute
    html.setAttribute('data-theme', theme);

    // Save preference
    localStorage.setItem(THEME_KEY, theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === LIGHT_THEME ? '#ffffff' : '#0f172a');
    }

    // Announce theme change for screen readers
    announceThemeChange(theme);
}

/**
 * Announce theme change for accessibility
 * @param {string} theme
 */
function announceThemeChange(theme) {
    const announcement = document.getElementById('theme-announcement');
    if (announcement) {
        announcement.textContent = theme === LIGHT_THEME ? 'Tema claro activado' : 'Tema oscuro activado';
    }
}

/**
 * Get current theme
 * @returns {string} 'light' or 'dark'
 */
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
}

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
    initializeTheme();
}

// Also run immediately to prevent flash
initializeTheme();
