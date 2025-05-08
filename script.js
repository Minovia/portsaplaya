// Global variables for translation
let translations = {};
let currentLang = 'es'; // Default language

// Function to load translations from JSON file
async function loadTranslations() {
    try {
        const response = await fetch('./translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
    } catch (error) {
        console.error("Could not load translations:", error);
        // Fallback or error handling
        translations = {}; // Ensure translations is an object
    }
}

// Function to update language selectors
function updateLanguageSelectors(lang) {
    const langSelectorDesktop = document.getElementById('language-selector');
    const langSelectorMobile = document.getElementById('language-selector-mobile');
    if (langSelectorDesktop) langSelectorDesktop.value = lang;
    if (langSelectorMobile) langSelectorMobile.value = lang;
}

// Function to translate the page content
function translatePage(lang) {
    if (!translations || Object.keys(translations).length === 0) {
        // console.warn("Translations not loaded yet or empty. Cannot translate.");
        return;
    }
    currentLang = lang;
    document.documentElement.lang = lang; // Update HTML lang attribute

    // Translate text content
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (translations[key] && translations[key][lang]) {
            // For the page title, handle it specifically
            if (element.tagName === 'TITLE') {
                document.title = translations[key][lang];
            } else {
                element.textContent = translations[key][lang];
            }
        } else {
            // console.warn(`Missing translation for key: ${key} in language: ${lang} for textContent`);
        }
    });

    // Translate alt attributes for images
    document.querySelectorAll('[data-translate-alt-key]').forEach(element => {
        const key = element.getAttribute('data-translate-alt-key');
        if (translations[key] && translations[key][lang]) {
            element.alt = translations[key][lang];
        } else {
            // console.warn(`Missing translation for alt key: ${key} in language: ${lang}`);
        }
    });

    // Translate placeholder attributes for inputs/textareas
    document.querySelectorAll('[data-translate-placeholder-key]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder-key');
        if (translations[key] && translations[key][lang]) {
            element.placeholder = translations[key][lang];
        } else {
            // console.warn(`Missing translation for placeholder key: ${key} in language: ${lang}`);
        }
    });
    
    // Update language selectors to reflect the current language
    updateLanguageSelectors(lang);

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}


// Initialize the application: load translations and set initial language
async function initializeApp() {
    await loadTranslations();
    
    const preferredLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['es', 'en', 'fr', 'de', 'it'];
    
    let langToLoad = 'es'; // Default
    if (preferredLanguage && supportedLanguages.includes(preferredLanguage)) {
        langToLoad = preferredLanguage;
    } else if (browserLanguage && supportedLanguages.includes(browserLanguage)) {
        langToLoad = browserLanguage;
    }
    
    translatePage(langToLoad); // This will also update selectors
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp(); // Load translations and set initial language

    // Language selector event listeners
    const langSelectorDesktop = document.getElementById('language-selector');
    const langSelectorMobile = document.getElementById('language-selector-mobile');

    if (langSelectorDesktop) {
        langSelectorDesktop.addEventListener('change', (event) => {
            translatePage(event.target.value);
        });
    }
    if (langSelectorMobile) {
        langSelectorMobile.addEventListener('change', (event) => {
            translatePage(event.target.value);
        });
    }

    // Manejar el estado activo de las tarjetas de vista al hacer clic
    const viewCards = document.querySelectorAll('.view-card');
    viewCards.forEach(card => {
        card.addEventListener('click', function() {
            viewCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Manejar el estado activo de las tarjetas de vista al hacer clic FUERA
    document.addEventListener('click', function(event) {
        const isClickInsideCard = event.target.closest('.view-card');
        if (!isClickInsideCard) {
            viewCards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const alertMessageKey = 'formSubmitSuccess';
            const message = (translations[alertMessageKey] && translations[alertMessageKey][currentLang]) 
                            ? translations[alertMessageKey][currentLang] 
                            : '¡Gracias por tu mensaje! Nos pondremos en contacto contigo lo antes posible.'; // Fallback
            alert(message);
            this.reset();
        });
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                 mobileMenu.classList.add('hidden');
            }
        });
    });
});