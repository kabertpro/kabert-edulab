/**
 * particles.js
 * Partículas flotantes muy simples para el fondo del Hero — puntos suaves
 * que se mueven despacio en los tres colores de marca. Nada de librerías,
 * bajo costo de CPU, se pausa fuera de pantalla y se desactiva por completo
 * si el usuario prefiere menos movimiento.
 */

(() => {
  function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const hero = document.querySelector('.hero');
    if (!canvas || !hero) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles, rafId;
    let running = false;

    const COLORS = ['15,110,100', '255,107,71', '242,174,30']; // brand, play, gold (RGB)
    const COUNT_PER_1000PX = 0.045; // densidad muy baja, look sutil

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = canvas.width = rect.width * window.devicePixelRatio;
      height = canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      const count = Math.min(70, Math.max(18, Math.floor((rect.width * rect.height) / 1000 * COUNT_PER_1000PX)));
      particles = Array.from({ length: count }, createParticle);
    }

    function createParticle() {
      const rect = hero.getBoundingClientRect();
      return {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.18 - 0.04,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.35 + 0.12,
      };
    }

    function step() {
      const rect = hero.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) { p.y = rect.height + 10; p.x = Math.random() * rect.width; }
        if (p.x < -10) p.x = rect.width + 10;
        if (p.x > rect.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    resize();
    start();

    window.addEventListener('resize', resize, { passive: true });

    // Pausar cuando el Hero no está en pantalla — ahorra batería/CPU.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0 }
      );
      io.observe(hero);
    }

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  }

  document.addEventListener('DOMContentLoaded', initParticles);
})();
