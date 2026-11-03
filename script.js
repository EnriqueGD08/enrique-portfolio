const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const scrollProgressBar = document.querySelector(".scroll-progress-bar");
const scrollProgressMarker = document.querySelector(".scroll-progress-marker");

const updateScrollProgress = () => {
  if (!scrollProgressBar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
  if (scrollProgressMarker) {
    const clamped = Math.min(progress, 100);
    // Evita que la burbuja se salga de la pantalla en los extremos
    scrollProgressMarker.style.left = `clamp(31px, ${clamped}%, calc(100% - 31px))`;
    scrollProgressMarker.textContent = `${Math.round(clamped)}%`;
  }
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const toggleHeaderState = () => header?.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", toggleHeaderState, { passive: true });
toggleHeaderState();

const revealTargets = document.querySelectorAll(
  ".hero-copy > *, .hero-visual, .statement-grid > *, .skill-strip, .section-heading, .timeline-item, .project-card, .education-card, .capability-group, .contact-header, .contact-email, .contact-details > *"
);
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${(i % 4) * 0.08}s`);
    revealObserver.observe(el);
  });
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

const navLinks = [...document.querySelectorAll(".main-nav a:not(.nav-cta)")];
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
navLinks.forEach((a) => {
  const target = document.querySelector(a.getAttribute("href"));
  if (target) sectionObserver.observe(target);
});
