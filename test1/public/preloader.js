// Manejo del Preloader
const preloader = document.getElementById('preloader');
const minimumDisplayTime = 1000; // Mínimo tiempo de visualización en milisegundos (2 segundos)
let startTime = Date.now();
let loadTime;

// Espera a que la página y todos sus recursos (imágenes, CSS, etc.) se carguen completamente
window.addEventListener('load', function() {
    loadTime = Date.now();
    const elapsedTime = loadTime - startTime;
    const remainingTime = minimumDisplayTime - elapsedTime;

    if (preloader) {
        if (remainingTime > 0) {
            // Si la carga fue más rápida que el tiempo mínimo, espera el tiempo restante
            setTimeout(function() {
                preloader.classList.add('preloader-hidden');
                // Elimina el elemento del DOM después de que la transición termine
                preloader.addEventListener('transitionend', function() {
                    preloader.remove();
                });
            }, remainingTime);
        } else {
            // Si la carga fue más lenta o igual que el tiempo mínimo, oculta inmediatamente
            preloader.classList.add('preloader-hidden');
             preloader.addEventListener('transitionend', function() {
                preloader.remove();
            });
        }
    }
});