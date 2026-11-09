/* =====================================================================
   Matías Pirrone — Portfolio v6
   JS sin dependencias (Bootstrap solo se usa para el grid/utilidades)
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Navbar: clase "scrolled" ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú mobile: overlay full-screen ---------- */
  var menu = document.getElementById('mobileMenu');
  var toggle = document.getElementById('menuToggle');
  var closeBtn = document.getElementById('menuClose');

  function isOpen() {
    return menu.classList.contains('is-open');
  }

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-open');
    closeBtn.focus();
  }

  function closeMenu(restoreFocus) {
    if (!isOpen()) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    // Se quita el bloqueo de scroll de forma síncrona para que el
    // scroll suave del anchor funcione en el mismo click.
    document.documentElement.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', function () { closeMenu(true); });

  // Cierre automático al pulsar cualquier link: el default del <a> sigue
  // actuando y lleva a la sección.
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      closeMenu(true);
    } else if (e.key === 'Tab') {
      // Focus trap dentro del overlay
      var focusables = menu.querySelectorAll('button, a');
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  // Si se pasa a desktop con el menú abierto, se cierra
  window.matchMedia('(min-width: 992px)').addEventListener('change', function (mq) {
    if (mq.matches) closeMenu(false);
  });

  /* ---------- Cards de proyecto expandibles ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card[data-category]'));

  function setExpanded(card, expanded) {
    var btn = card.querySelector('.btn-details');
    card.classList.toggle('is-expanded', expanded);
    btn.setAttribute('aria-expanded', String(expanded));
    btn.querySelector('.btn-details-text').textContent = expanded ? 'Ocultar detalles' : 'Ver detalles';
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      // Los links (GitHub) mantienen su comportamiento normal
      if (e.target.closest('a')) return;
      // No colapsar si el usuario está seleccionando texto
      if (!e.target.closest('.btn-details') && String(window.getSelection())) return;
      setExpanded(card, !card.classList.contains('is-expanded'));
    });
  });

  /* ---------- Tabs de filtro de proyectos ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.project-tab'));
  var panel = document.getElementById('projectList');
  var FADE_MS = 250;
  var filterTimer = null;

  function matches(card, filter) {
    var cats = card.getAttribute('data-category').split(' ');
    return filter === 'all' || cats.indexOf('always') !== -1 || cats.indexOf(filter) !== -1;
  }

  function applyFilter(filter) {
    clearTimeout(filterTimer);
    // 1) fade-out de todas las visibles
    cards.forEach(function (card) {
      if (!card.classList.contains('is-hidden')) card.classList.add('is-fading');
    });
    filterTimer = setTimeout(function () {
      // 2) mostrar/ocultar según filtro (aún transparentes)
      cards.forEach(function (card) {
        card.classList.toggle('is-hidden', !matches(card, filter));
        card.classList.add('is-fading');
      });
      void panel.offsetHeight; // fuerza reflow para que la transición se ejecute
      // 3) fade-in de las que quedan
      cards.forEach(function (card) {
        if (!card.classList.contains('is-hidden')) card.classList.remove('is-fading');
      });
    }, FADE_MS);
  }

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    if (focus) tab.focus();
    applyFilter(tab.getAttribute('data-filter'));
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      if (!tab.classList.contains('is-active')) selectTab(tab, false);
    });
    // Navegación con flechas (patrón WAI-ARIA tabs)
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- FAQ acordeón ---------- */
  // Son <button>, así que Enter y Space funcionan de forma nativa.
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Fade-in de secciones al hacer scroll ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    var targets = document.querySelectorAll('.stats-banner .container, .section > .container');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
})();
