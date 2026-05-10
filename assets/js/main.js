/**
 * Main UI interactions:
 * - Feather icons
 * - Footer year
 * - Mobile nav toggle
 * - Scroll reveal animations
 * - Scroll spy for active nav link
 * - Keyboard shortcuts to focus search
 * - Premium hero avatar pointer tracking
 */

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function initAvatar() {
    const avatar = $("[data-avatar]");
    if (!avatar) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const shell = $('[data-avatar-part="head"]', avatar);
    const halo = $('[data-avatar-part="halo"]', avatar);
    const back = $('[data-avatar-part="back"]', avatar);
    const front = $('[data-avatar-part="front"]', avatar);
    const eyes = $$("[data-avatar-eye]", avatar);

    let bounds = null;
    let rafId = 0;
    let active = false;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const setTargetFromPointer = (event) => {
      if (!bounds) bounds = avatar.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      target.x = Math.max(-1, Math.min(1, x));
      target.y = Math.max(-1, Math.min(1, y));
    };

    const apply = () => {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;

      const x = current.x;
      const y = current.y;
      avatar.style.setProperty("--avatar-tilt-x", `${x * 4.2}deg`);
      avatar.style.setProperty("--avatar-tilt-y", `${y * -3.2}deg`);
      avatar.style.setProperty("--avatar-depth-x", `${x * 5}px`);
      avatar.style.setProperty("--avatar-depth-y", `${y * 4}px`);

      if (shell) shell.style.transform = `rotate(${x * 1.4}deg) translate(${x * 1.2}px, ${y * 1.4}px)`;
      if (halo) halo.style.transform = `translate3d(${x * -7}px, ${y * -7}px, -42px) scale(0.92)`;
      if (back) back.style.transform = `translate(${x * -4}px, ${y * -3}px)`;
      if (front) front.style.transform = `translate(${x * 2.5}px, ${y * 2}px)`;
      eyes.forEach((eye) => {
        eye.style.transform = `translate(${x * 4.2}px, ${y * 3.2}px)`;
      });

      const settled =
        Math.abs(target.x - current.x) < 0.002 &&
        Math.abs(target.y - current.y) < 0.002 &&
        Math.abs(target.x) < 0.002 &&
        Math.abs(target.y) < 0.002;

      if (active || !settled) {
        rafId = requestAnimationFrame(apply);
      } else {
        rafId = 0;
      }
    };

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    const isIntentionalPointer = (event) =>
      !event.pointerType || event.pointerType === "mouse" || event.pointerType === "pen";

    avatar.addEventListener("pointerenter", (event) => {
      if (!isIntentionalPointer(event)) return;
      active = true;
      bounds = avatar.getBoundingClientRect();
      setTargetFromPointer(event);
      start();
    });

    avatar.addEventListener("pointermove", (event) => {
      if (!active || !isIntentionalPointer(event)) return;
      setTargetFromPointer(event);
      start();
    });

    avatar.addEventListener("pointerleave", (event) => {
      if (!isIntentionalPointer(event)) return;
      active = false;
      bounds = null;
      target.x = 0;
      target.y = 0;
      start();
    });

    window.addEventListener(
      "resize",
      () => {
        bounds = null;
      },
      { passive: true }
    );
  }

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

    // Header shadow on scroll
    const header = $(".site-header");
    const applyScrolled = () => {
      if (!header) return;
      if (window.scrollY > 2) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    applyScrolled();
    window.addEventListener("scroll", applyScrolled, { passive: true });

    // Scroll reveal animations (with light stagger)
    const revealEls = $$(".reveal");
    if (revealEls.length) {
      const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReduced) {
        revealEls.forEach((el, i) => {
          el.style.transitionDelay = Math.min(i * 60, 600) + "ms";
        });
      }

      if ("IntersectionObserver" in window) {
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
    }

    // Scroll spy for active nav link
    const sections = [
      "#overview",
      "#expertise",
      "#experience",
      "#research",
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

    initAvatar();
  });
})();
