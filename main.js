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
})();
