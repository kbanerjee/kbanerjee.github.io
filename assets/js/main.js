/**
 * Main UI interactions:
 * - Feather icons
 * - Footer year
 * - Mobile nav toggle
 * - Scroll reveal animations
 * - Scroll spy for active nav link
 * - Keyboard shortcuts to focus search
 */

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener("DOMContentLoaded", () => {
    // Footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Feather icons
    if (window.feather && typeof window.feather.replace === "function") {
      window.feather.replace();
    }

    // Mobile nav toggle
    const toggleBtn = $(".nav__toggle");
    const menu = $("#nav-menu");
    const navLinks = $$(".nav__links a");

    const closeMenu = () => {
      if (!menu) return;
      menu.classList.remove("show");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      if (!menu) return;
      menu.classList.add("show");
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
    };

    if (toggleBtn && menu) {
      toggleBtn.addEventListener("click", () => {
        const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
        expanded ? closeMenu() : openMenu();
      });
      // Close on link click (for mobile)
      navLinks.forEach((a) =>
        a.addEventListener("click", () => {
          closeMenu();
        })
      );
      // Close on Escape
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
      });
    }

    // Scroll reveal animations
    const revealEls = $$(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-in");
              obs.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      // Fallback: show immediately
      revealEls.forEach((el) => el.classList.add("reveal-in"));
    }

    // Scroll spy for active nav link
    const sections = [
      "#about",
      "#skills",
      "#experience",
      "#education",
      "#certifications",
      "#publications",
      "#achievements",
      "#contact",
    ]
      .map((id) => $(id))
      .filter(Boolean);

    const linkById = new Map();
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href.startsWith("#")) linkById.set(href.slice(1), a);
    });

    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.remove("active"));
      const link = linkById.get(id);
      if (link) link.classList.add("active");
    };

    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          // Choose the most visible entry
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]) {
            const id = visible[0].target.id;
            if (id) setActive(id);
          }
        },
        {
          root: null,
          rootMargin: "-45% 0px -50% 0px",
          threshold: [0.1, 0.25, 0.5, 0.75],
        }
      );
      sections.forEach((s) => spy.observe(s));
    }

    // Keyboard shortcuts for search
    const searchInput = $("#site-search");
    const focusSearch = () => {
      if (!searchInput) return;
      searchInput.focus();
      // Move caret to end
      const v = searchInput.value;
      searchInput.value = "";
      searchInput.value = v;
    };

    // Focus search with "/" (unless typing in input/textarea/select)
    document.addEventListener("keydown", (e) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.isContentEditable);

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        focusSearch();
      }
      // Cmd/Ctrl+K also focuses search
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        focusSearch();
      }
      // Escape clears search
      if (e.key === "Escape" && searchInput && document.activeElement === searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.blur();
      }
    });
  });
})();
