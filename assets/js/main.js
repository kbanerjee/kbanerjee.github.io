/* ============================================================
   main.js – portfolio interactions (vanilla JS, no build step)
   ============================================================ */

/**
 * 1. Intersection-Observer: reveal elements with data-reveal
 *    They will gain the Tailwind utility 'animate-fade-up' once 20 % visible.
 *    Respects prefers-reduced-motion automatically (CSS handles disabling).
 */
(function revealOnScroll() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return; // Skip animations entirely

  const revealEls = document.querySelectorAll("[data-reveal]");
  const options = { threshold: 0.2 };
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("animate-fade-up");
      obs.unobserve(entry.target);
    });
  }, options);

  revealEls.forEach((el) => io.observe(el));
})();

/**
 * 2. Mobile navigation drawer
 *    – Toggle button (#nav-toggle)
 *    – Overlay (#mobile-nav) slides in with custom class + Tailwind classes
 */
(function mobileNav() {
  const btn = document.getElementById("nav-toggle");
  const panel = document.getElementById("mobile-nav");

  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    panel.classList.toggle("hidden");
    if (!expanded) {
      panel.classList.add("mobile-nav-enter");
    } else {
      panel.classList.remove("mobile-nav-enter");
    }
  });

  // Hide panel when any link is clicked (delegation)
  panel.addEventListener("click", (e) => {
    if (e.target.matches('a[href^="#"]')) {
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();

/**
 * 3. Active-section link highlighting (desktop nav)
 */
(function activeLinkObserver() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("a[data-scrollspy]");
  if (!sections.length || !navLinks.length) return;

  const opts = { threshold: 0.6 };
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("text-indigo-600", active);
          link.setAttribute("aria-current", active ? "page" : "");
        });
      }
    });
  }, opts);

  sections.forEach((s) => spy.observe(s));
})();

/* 4. Smooth-scroll polyfill for older browsers (tiny helper) */
(function smoothScrollPolyfill() {
  if ("scrollBehavior" in document.documentElement.style) return;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
})();

/**
 * 5. Theme toggle (sun/moon) with localStorage persistence
 */
(function themeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
})();

/**
 * 6. Back-to-top button visibility & smooth scroll
 */
(function backToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle("hidden", window.scrollY < 600);
  };

  window.addEventListener("scroll", toggle);
  toggle(); // initial

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
