/**
 * pwa.js
 * Registro del service worker e instalación de la PWA (evento
 * beforeinstallprompt) con botones tanto en el header como en el menú móvil.
 */

(() => {
  let deferredPrompt = null;

  function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('service-worker.js')
        .catch((err) => console.error('[SW] Registro fallido:', err));
    });
  }

  function initInstallPrompt() {
    const installButtons = document.querySelectorAll('.btn-install');
    if (!installButtons.length) return;

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredPrompt = event;
      installButtons.forEach((btn) => btn.classList.add('is-visible'));
    });

    installButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          window.KabertUI?.showToast('Instalando Kabert EduLab…');
        }
        deferredPrompt = null;
        installButtons.forEach((b) => b.classList.remove('is-visible'));
      });
    });

    window.addEventListener('appinstalled', () => {
      installButtons.forEach((btn) => btn.classList.remove('is-visible'));
      window.KabertUI?.showToast('¡Kabert EduLab instalado con éxito!');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initServiceWorker();
    initInstallPrompt();
  });
})();
