/**
 * script.js
 * ---------------------------------------------------------------------------
 * Proyecto:    Portfolio personal 2026 (sitio estático, sin dependencias)
 * Autor:       Enrique Gómez Díaz
 * Mail:        enriquegd2004@gmail.com
 * Web:         https://github.com/EnriqueGD08
 * Fecha:       creación 2026-10-06 · última modificación 2026-11-09
 * Versión:     1.0
 *
 * Descripción: comportamiento de la página. No genera contenido: solo mejora
 *              lo que ya está en index.html (la web funciona sin JavaScript).
 *
 * Funcionalidades (una función `init...` por cada una):
 *   - Menú hamburguesa en móvil.
 *   - Año actual en el pie de página.
 *   - Barra de progreso de lectura con porcentaje.
 *   - Cabecera que cambia de aspecto al hacer scroll.
 *   - Animaciones de aparición al entrar en pantalla.
 *   - Enlace de la sección visible resaltado en el menú.
 *
 * Principios aplicados:
 *   - SRP: cada función hace una sola cosa y no conoce a las demás.
 *   - OCP: para añadir una mejora se escribe otra función `init...` y se
 *          registra en `init()`; no hay que tocar las existentes.
 *   - DRY: selectores, clases y umbrales viven en CONFIG, sin números mágicos.
 *   - Degradación elegante: si falta un elemento o el navegador no soporta
 *     IntersectionObserver, la función correspondiente no hace nada y la
 *     página sigue siendo usable.
 * ---------------------------------------------------------------------------
 */

"use strict";

/**
 * Valores configurables del script (selectores, clases CSS y umbrales).
 * Centralizarlos evita repetir cadenas y permite ajustarlos en un único sitio.
 */
const CONFIG = Object.freeze({
  selectors: {
    menuToggle: ".menu-toggle",
    mainNav: ".main-nav",
    navLinks: ".main-nav a:not(.nav-cta)",
    currentYear: "#current-year",
    progressBar: ".scroll-progress-bar",
    progressMarker: ".scroll-progress-marker",
    header: ".site-header",
    // Elementos que aparecen con animación al entrar en pantalla.
    revealTargets: [
      ".hero-copy > *",
      ".hero-visual",
      ".statement-grid > *",
      ".skill-strip",
      ".section-heading",
      ".timeline-item",
      ".project-card",
      ".education-card",
      ".capability-group",
      ".contact-header",
      ".contact-email",
      ".contact-details > *",
    ].join(", "),
  },
  classes: {
    jsEnabled: "js",
    navOpen: "is-open",
    navActive: "is-active",
    headerScrolled: "is-scrolled",
    reveal: "reveal",
    revealVisible: "is-visible",
  },
  /** Píxeles de scroll a partir de los cuales la cabecera cambia de aspecto. */
  headerScrollThreshold: 10,
  /** Mitad del ancho de la burbuja de progreso (px), para que no se salga de la pantalla. */
  progressMarkerHalfWidth: 31,
  reveal: {
    /** Fracción del elemento que debe verse para activar su animación. */
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
    /** Los elementos se retrasan en grupos de este tamaño para escalonar la entrada. */
    staggerGroupSize: 4,
    /** Segundos de retraso entre elementos consecutivos de un grupo. */
    staggerStep: 0.08,
  },
  /** Franja central de la pantalla que se considera "sección visible" para el menú. */
  activeSectionMargin: "-45% 0px -50% 0px",
});

/**
 * Atajo para `document.querySelector` con el selector ya validado.
 * @param {string} selector Selector CSS.
 * @returns {Element|null} El primer elemento que coincide, o null.
 */
const $ = (selector) => document.querySelector(selector);

/**
 * Convierte un valor numérico en un porcentaje limitado al rango 0–100.
 * @param {number} value Valor a limitar.
 * @returns {number} El valor dentro de [0, 100].
 */
const clampPercent = (value) => Math.min(Math.max(value, 0), 100);

/**
 * Indica que hay JavaScript disponible. El CSS usa la clase `js` para ocultar
 * los elementos animados solo cuando sabe que el script los volverá a mostrar.
 * @returns {void}
 */
function markJsEnabled() {
  document.documentElement.classList.add(CONFIG.classes.jsEnabled);
}

/**
 * Menú hamburguesa: abre y cierra el menú, mantiene `aria-expanded`
 * actualizado para lectores de pantalla y lo cierra al pulsar un enlace.
 * @returns {void}
 */
function initMobileMenu() {
  const toggle = $(CONFIG.selectors.menuToggle);
  const nav = $(CONFIG.selectors.mainNav);
  if (!toggle || !nav) return;

  /**
   * Abre o cierra el menú y refleja el estado en el atributo ARIA.
   * @param {boolean} open true para abrirlo, false para cerrarlo.
   * @returns {void}
   */
  const setOpen = (open) => {
    nav.classList.toggle(CONFIG.classes.navOpen, open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () =>
    setOpen(!nav.classList.contains(CONFIG.classes.navOpen))
  );
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => setOpen(false))
  );
}

/**
 * Escribe el año actual en el pie de página (así no hay que editarlo cada año).
 * @returns {void}
 */
function initCurrentYear() {
  const year = $(CONFIG.selectors.currentYear);
  if (year) year.textContent = String(new Date().getFullYear());
}

/**
 * Calcula cuánto se ha desplazado la página, de 0 a 100.
 * @returns {number} Porcentaje de scroll (0 si la página no es desplazable).
 */
function getScrollPercent() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable > 0 ? clampPercent((window.scrollY / scrollable) * 100) : 0;
}

/**
 * Barra de progreso de lectura: ancho de la barra y posición y texto de la
 * burbuja con el porcentaje. Se actualiza al hacer scroll y al cambiar el tamaño.
 * @returns {void}
 */
function initScrollProgress() {
  const bar = $(CONFIG.selectors.progressBar);
  const marker = $(CONFIG.selectors.progressMarker);
  if (!bar) return;

  /**
   * Dibuja el estado actual del progreso en la barra y en la burbuja.
   * @returns {void}
   */
  const render = () => {
    const percent = getScrollPercent();
    bar.style.width = `${percent}%`;
    if (!marker) return;
    // clamp() evita que la burbuja se salga de la pantalla en los extremos.
    const half = CONFIG.progressMarkerHalfWidth;
    marker.style.left = `clamp(${half}px, ${percent}%, calc(100% - ${half}px))`;
    marker.textContent = `${Math.round(percent)}%`;
  };

  window.addEventListener("scroll", render, { passive: true });
  window.addEventListener("resize", render);
  render();
}

/**
 * Cabecera: añade una clase cuando la página ya no está arriba del todo,
 * para que el CSS le ponga borde y fondo más opaco.
 * @returns {void}
 */
function initHeaderState() {
  const header = $(CONFIG.selectors.header);
  if (!header) return;

  /**
   * Activa o desactiva la clase según la posición del scroll.
   * @returns {void}
   */
  const update = () =>
    header.classList.toggle(
      CONFIG.classes.headerScrolled,
      window.scrollY > CONFIG.headerScrollThreshold
    );

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/**
 * Animaciones de aparición: cada elemento se muestra con un fundido la primera
 * vez que entra en pantalla. Si el navegador no soporta IntersectionObserver,
 * se muestran todos de golpe para no dejar contenido oculto.
 * @returns {void}
 */
function initRevealOnScroll() {
  const { reveal: cls, revealVisible } = CONFIG.classes;
  const targets = document.querySelectorAll(CONFIG.selectors.revealTargets);

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add(revealVisible));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(revealVisible);
        observer.unobserve(entry.target); // solo se anima una vez
      }),
    { threshold: CONFIG.reveal.threshold, rootMargin: CONFIG.reveal.rootMargin }
  );

  targets.forEach((el, index) => {
    el.classList.add(cls);
    // Retraso escalonado para que los elementos de un mismo grupo no salgan a la vez.
    const delay = (index % CONFIG.reveal.staggerGroupSize) * CONFIG.reveal.staggerStep;
    el.style.setProperty("--delay", `${delay}s`);
    observer.observe(el);
  });
}

/**
 * Resalta en el menú el enlace de la sección que se está viendo en pantalla.
 * @returns {void}
 */
function initActiveNavLink() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll(CONFIG.selectors.navLinks)];

  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle(
            CONFIG.classes.navActive,
            link.getAttribute("href") === `#${entry.target.id}`
          )
        );
      }),
    { rootMargin: CONFIG.activeSectionMargin }
  );

  links.forEach((link) => {
    const section = $(link.getAttribute("href"));
    if (section) observer.observe(section);
  });
}

/**
 * Punto de entrada: registra cada funcionalidad. Para añadir una nueva basta
 * con escribir su función `init...` y llamarla aquí (principio abierto/cerrado).
 * @returns {void}
 */
function init() {
  markJsEnabled(); // primero: el CSS de las animaciones depende de esta clase
  initMobileMenu();
  initCurrentYear();
  initScrollProgress();
  initHeaderState();
  initRevealOnScroll();
  initActiveNavLink();
}

init();
