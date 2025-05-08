document.addEventListener('DOMContentLoaded', () => {
  const languageToggleButtons = document.querySelectorAll('#language-toggle, #language-toggle-mobile');
  console.log("Language toggle buttons found:", languageToggleButtons.length); // Log 1
  let currentLang = localStorage.getItem('preferredLang') || 'es';
  console.log("Initial language:", currentLang); // Log 2
  let translations = null; // Inicializar como null

  async function fetchTranslations() {
      console.log("Fetching translations..."); // Log 3
      try {
          const response = await fetch('./translations.json');
          if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}`); // Log error
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          translations = await response.json(); // Asignar a la variable externa
          console.log("Translations loaded."); // Log 4
          applyTranslations(); // Aplicar después de la carga exitosa
      } catch (error) {
          console.error("Could not load translations:", error); // Log error
          translations = {}; // Establecer a objeto vacío en caso de fallo
      }
  }

  function getNestedTranslation(obj, path, lang) {
      const keys = path.split('.');
      let current = obj;
      for (const key of keys) {
          if (current && typeof current === 'object' && key in current) {
              current = current[key];
          } else {
              // console.warn(`Translation key not found: ${path} (missing part: ${key})`); // Descomentar para depuración detallada
              return null; // Ruta no encontrada
          }
      }
      // Devolver traducción para el idioma, o el valor si es una cadena (fallback), o null
      return current && typeof current === 'object' && lang in current ? current[lang] : (typeof current === 'string' ? current : null);
  }

  function applyTranslations() {
      console.log("Attempting to apply translations for language:", currentLang); // Log 5
      if (!translations) {
           console.warn("Translations not loaded yet. Skipping application.");
           return; // Traducciones no cargadas aún
      }
       if (Object.keys(translations).length === 0) {
           console.warn("Translations object is empty (fetch failed?). Cannot apply translations.");
           return; // Objeto de traducciones vacío
      }

      document.documentElement.lang = currentLang;
      console.log("HTML lang attribute set to:", currentLang);

      // Aplicar traducciones de contenido de texto
      document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          const translation = getNestedTranslation(translations, key, currentLang);
          if (translation !== null) { // Comprobar explícitamente si no es null
              el.textContent = translation;
          } else {
               // console.warn(`No text translation found for key: ${key} in language: ${currentLang}`); // Descomentar para depuración detallada
          }
      });

      // Aplicar traducciones de atributos (alt, placeholder)
       document.querySelectorAll('[data-translate-alt]').forEach(el => {
          const key = el.getAttribute('data-translate-alt');
          const translation = getNestedTranslation(translations, key, currentLang);
          if (translation !== null) {
              el.alt = translation;
          } else {
               // console.warn(`No alt translation found for key: ${key} in language: ${currentLang}`); // Descomentar para depuración detallada
          }
      });

       document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
          const key = el.getAttribute('data-translate-placeholder');
          const translation = getNestedTranslation(translations, key, currentLang);
          if (translation !== null) {
              el.placeholder = translation;
          } else {
               // console.warn(`No placeholder translation found for key: ${key} in language: ${currentLang}`); // Descomentar para depuración detallada
          }
      });


      // Actualizar título de la página
      const pageTitleKey = "pageTitle";
      const pageTitleTranslation = getNestedTranslation(translations, pageTitleKey, currentLang);
      if (pageTitleTranslation !== null) {
          document.title = pageTitleTranslation;
      } else {
           // console.warn(`No translation found for page title key: ${pageTitleKey} in language: ${currentLang}`); // Descomentar para depuración detallada
      }

      // Actualizar texto del botón de cambio de idioma
      const langButtonKey = "languageSelector";
      const langButtonText = getNestedTranslation(translations, langButtonKey, currentLang);
      languageToggleButtons.forEach(button => {
          if (langButtonText !== null) {
              button.textContent = langButtonText;
          } else {
               // console.warn(`No translation found for language selector key: ${langButtonKey} in language: ${currentLang}`); // Descomentar para depuración detallada
          }
      });

      // Hacer traducciones disponibles globalmente para otros scripts
      window.currentTranslations = translations;
      window.currentActiveLang = currentLang;
      console.log("Translations applied."); // Log 6
  }

  // Listener de eventos para los botones
  languageToggleButtons.forEach(button => {
      button.addEventListener('click', () => {
          console.log("Language toggle button clicked. Current lang:", currentLang); // Log 7
          currentLang = currentLang === 'es' ? 'en' : 'es';
          localStorage.setItem('preferredLang', currentLang);
          console.log("New lang:", currentLang); // Log 8
          applyTranslations(); // Llamar a applyTranslations con el nuevo idioma
      });
  });

  // Carga inicial
  fetchTranslations();
});