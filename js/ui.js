/**
 * ui.js
 * Interacciones de interfaz: tema claro/oscuro, menú móvil, header al hacer
 * scroll, render de tarjetas de apps y novedades, filtros, copiar/compartir,
 * botón volver arriba y animaciones de aparición.
 */

(() => {
  const THEME_KEY = 'kabert-theme';
  const root = document.documentElement;

  /* ---------------------------------------------------------------------
     Tema claro / oscuro
  --------------------------------------------------------------------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B0D12' : '#0F6E64');
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ---------------------------------------------------------------------
     Header: sombra/borde al hacer scroll
  --------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Menú móvil
  --------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-mobile');
    if (!toggle || !nav) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 960) close();
    });
  }

  /* ---------------------------------------------------------------------
     Splash screen
  --------------------------------------------------------------------- */
  function initSplash() {
    const splash = document.querySelector('.splash');
    if (!splash) return;
    const hide = () => splash.classList.add('is-hidden');
    if (document.readyState === 'complete') {
      setTimeout(hide, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 400));
    }
    // Nunca dejar el splash bloqueando más de 2.5s por si algo falla
    setTimeout(hide, 2500);
  }

  /* ---------------------------------------------------------------------
     Volver arriba
  --------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('is-visible', window.scrollY > 700);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------------------
     Toast
  --------------------------------------------------------------------- */
  let toastTimer;
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------
     Iconos SVG reutilizables (inline, sin dependencias externas)
  --------------------------------------------------------------------- */
  const icons = {
    open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  };

  /* ---------------------------------------------------------------------
     Render: tiles del Hero (vitrina superior con miniaturas reales)
  --------------------------------------------------------------------- */
  function heroTileHTML(app) {
    return `
      <div class="hero-tile" style="--tile-c:${app.color}">
        <img src="${app.thumbnail}" alt="" loading="lazy" onerror="this.remove();">
        <span>${app.code} · ${app.name}</span>
      </div>`;
  }

  function renderHeroTiles(apps) {
    const container = document.getElementById('heroTiles');
    if (!container || !apps.length) return;
    container.innerHTML = apps.slice(0, 4).map(heroTileHTML).join('');
  }

  /* ---------------------------------------------------------------------
     Render: Experiencias educativas
  --------------------------------------------------------------------- */
  let allApps = [];

  function categoryChip(category) {
    return category;
  }

  function renderFilters(apps, grid) {
    const bar = document.querySelector('.filter-bar');
    if (!bar) return;
    const categories = ['Todas', ...new Set(apps.map((a) => a.category))];
    bar.innerHTML = categories
      .map((cat, i) => `<button class="filter-chip${i === 0 ? ' is-active' : ''}" data-filter="${cat}">${cat}</button>`)
      .join('');

    bar.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      bar.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.dataset.filter;
      const filtered = filter === 'Todas' ? allApps : allApps.filter((a) => a.category === filter);
      renderAppCards(filtered, grid);
    });
  }

  function appCardHTML(app) {
    const initials = app.name.slice(0, 2).toUpperCase();
    return `
      <article class="app-card reveal" data-id="${app.id}">
        <div class="app-thumb">
          <img src="${app.thumbnail}" alt="Captura de ${app.name}" loading="lazy"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
          <div class="app-thumb-fallback" style="display:none; background:${app.color};">${initials}</div>
          <span class="app-code mono">${app.code}</span>
          <span class="app-category">${app.category}</span>
        </div>
        <div class="app-body">
          <h3 class="app-name">${app.name}</h3>
          <p class="app-tagline">${app.tagline}</p>
          <p class="app-desc">${app.description}</p>
          <p class="app-meta mono">v${app.version}</p>
          <div class="app-actions">
            <a class="btn btn-primary" href="${app.url}" target="_blank" rel="noopener">
              ${icons.open}<span>Abrir</span>
            </a>
            <button class="icon-btn btn-ghost" data-action="copy" data-url="${app.url}" aria-label="Copiar enlace de ${app.name}" title="Copiar enlace">
              ${icons.link}
            </button>
            <button class="icon-btn btn-ghost" data-action="share" data-url="${app.url}" data-name="${app.name}" aria-label="Compartir ${app.name}" title="Compartir">
              ${icons.share}
            </button>
            <button class="icon-btn btn-ghost" data-action="info" data-id="${app.id}" aria-label="Más información sobre ${app.name}" title="Más información">
              ${icons.info}
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderAppCards(apps, grid) {
    grid.innerHTML = apps.map(appCardHTML).join('') || `
      <div class="empty-state" style="grid-column:1/-1;">
        <strong>No hay aplicaciones en esta categoría todavía.</strong>
        Vuelve pronto — seguimos ampliando el catálogo.
      </div>`;
    initReveal();
  }

  async function initApps() {
    const grid = document.querySelector('.apps-grid');
    if (!grid) return;
    allApps = await KabertData.getApps();
    renderFilters(allApps, grid);
    renderAppCards(allApps, grid);
    renderHeroTiles(allApps);

    grid.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const { action, url, name, id } = btn.dataset;

      if (action === 'copy') {
        try {
          await navigator.clipboard.writeText(url);
          showToast('Enlace copiado al portapapeles');
        } catch {
          showToast('No se pudo copiar el enlace');
        }
      }

      if (action === 'share') {
        if (navigator.share) {
          try {
            await navigator.share({ title: name, text: `Descubre ${name} en Kabert EduLab`, url });
          } catch {
            /* usuario canceló, no hacer nada */
          }
        } else {
          try {
            await navigator.clipboard.writeText(url);
            showToast('Tu navegador no soporta compartir — enlace copiado');
          } catch {
            showToast('Comparte este enlace: ' + url);
          }
        }
      }

      if (action === 'info') {
        const app = allApps.find((a) => a.id === id);
        if (app) showToast(`${app.name} · ${app.category} · v${app.version}`);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Render: Novedades
  --------------------------------------------------------------------- */
  async function initNews() {
    const strip = document.querySelector('.news-strip');
    const emptyEl = document.querySelector('.news-empty');
    if (!strip) return;
    const news = await KabertData.getNews();

    if (!news.length) {
      strip.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    strip.hidden = false;
    if (emptyEl) emptyEl.hidden = true;
    strip.innerHTML = news
      .map(
        (item) => `
        <article class="news-card reveal">
          <p class="news-date mono">${item.date || ''}</p>
          <h3 class="news-title">${item.title}</h3>
          <p class="news-desc">${item.description}</p>
        </article>`
      )
      .join('');
    initReveal();
  }

  /* ---------------------------------------------------------------------
     Render: Seminarios realizados
  --------------------------------------------------------------------- */
  function seminarCardHTML(seminar) {
    return `
      <article class="seminar-card reveal">
        <img src="${seminar.thumbnail}" alt="${seminar.title}" loading="lazy"
             onerror="this.remove();">
        <div class="seminar-info">
          <p class="seminar-date mono">${seminar.date || ''}</p>
          <h3 class="seminar-title">${seminar.title}</h3>
          <p class="seminar-place">${seminar.place || ''}</p>
        </div>
      </article>`;
  }

  async function initSeminars() {
    const grid = document.querySelector('.seminar-grid');
    const emptyEl = document.querySelector('.seminar-empty');
    if (!grid) return;
    const seminars = await KabertData.getSeminars();

    if (!seminars.length) {
      grid.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    grid.hidden = false;
    if (emptyEl) emptyEl.hidden = true;
    grid.innerHTML = seminars.map(seminarCardHTML).join('');
    initReveal();
  }

  /* ---------------------------------------------------------------------
     Año dinámico + init general
  --------------------------------------------------------------------- */
  function initFooterYear() {
    const el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSplash();
    initHeaderScroll();
    initMobileMenu();
    initBackToTop();
    initFooterYear();
    initApps();
    initNews();
    initSeminars();
    initReveal();

    document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);
  });

  window.KabertUI = { showToast };
})();
