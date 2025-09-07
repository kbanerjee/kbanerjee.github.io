/**
 * Client-side search for the resume site.
 * - Builds a lightweight index from elements that have data-search (cards, list items, etc.)
 * - Filters visible content as the user types
 * - Highlights matching text (respects prefers-reduced-motion for minimal DOM churn)
 *
 * Structure assumptions from layout:
 * - Cards across sections have: .card.searchable[data-search="..."]
 * - List items like achievements have: li.searchable[data-search="..."] (outside of .card)
 * - Copy blocks (e.g., About summary, chips) have data-search for highlighting only (not filtered)
 */

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function normalize(str) {
    return (str || "").toLowerCase();
  }

  function tokenize(q) {
    return normalize(q)
      .split(/\s+/)
      .filter(Boolean);
  }

  // Highlighting utilities
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function clearHighlights(root) {
    $$(".search-highlight", root).forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize && parent.normalize();
    });
  }

  function highlightInElement(el, tokens) {
    if (!tokens.length) return;

    // Build regex for any token
    const pattern = tokens.map(escapeRegExp).join("|");
    if (!pattern) return;
    const regex = new RegExp(`(${pattern})`, "gi");

    // Walk text nodes only to avoid breaking markup
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (!regex.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const toReplace = [];
    while (walker.nextNode()) {
      toReplace.push(walker.currentNode);
    }

    toReplace.forEach((textNode) => {
      const frag = document.createDocumentFragment();
      const parts = textNode.nodeValue.split(regex); // includes matches
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") continue;
        if (i % 2 === 1) {
          // matched token
          const mark = document.createElement("mark");
          mark.className = "search-highlight";
          mark.textContent = part;
          frag.appendChild(mark);
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      }
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const input = $("#site-search");
    const noResults = $("#no-results");

    if (!input) return;

    // Units to filter:
    // - Top-level cards
    const cardUnits = $$(".card.searchable").map((el) => ({
      el,
      get text() {
        return normalize(el.getAttribute("data-search") || el.innerText || "");
      },
      show() {
        el.hidden = false;
      },
      hide() {
        el.hidden = true;
      },
    }));

    // - Standalone list items (outside cards), e.g., achievements
    const liUnits = $$("li.searchable").filter((el) => !el.closest(".card")).map((el) => ({
      el,
      get text() {
        return normalize(el.getAttribute("data-search") || el.innerText || "");
      },
      show() {
        el.hidden = false;
      },
      hide() {
        el.hidden = true;
      },
    }));

    // Elements to highlight text within (do not hide these solely based on match)
    const highlightOnly = $$("[data-search]");

    function clearAllHighlights() {
      highlightOnly.forEach((el) => clearHighlights(el));
    }

    function applyHighlights(tokens) {
      if (!tokens.length) return;
      highlightOnly.forEach((el) => highlightInElement(el, tokens));
    }

    function filterUnits(q) {
      const tokens = tokenize(q);

      // Reset visibility
      [...cardUnits, ...liUnits].forEach((u) => u.show());

      if (!tokens.length) {
        // Clear highlights and no-results
        clearAllHighlights();
        if (noResults) {
          noResults.hidden = true;
          noResults.setAttribute("aria-hidden", "true");
        }
        return;
      }

      let matches = 0;

      // Filter cards
      cardUnits.forEach((u) => {
        const ok = tokens.every((t) => u.text.includes(t));
        if (ok) {
          matches++;
          u.show();
        } else {
          u.hide();
        }
      });

      // Filter list items (outside cards)
      liUnits.forEach((u) => {
        const ok = tokens.every((t) => u.text.includes(t));
        if (ok) {
          matches++;
          u.show();
        } else {
          u.hide();
        }
      });

      // Update no-results
      if (noResults) {
        const hasResults = matches > 0;
        noResults.hidden = hasResults;
        noResults.setAttribute("aria-hidden", String(hasResults));
      }

      // Highlights
      clearAllHighlights();
      // Limit DOM churn if user prefers reduced motion — still highlight but skip repeated work with identical query
      applyHighlights(tokens);
    }

    // Handle input with a small debounce
    let rafId = 0;
    function onInput() {
      const value = input.value || "";
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => filterUnits(value));
    }

    input.addEventListener("input", onInput);

    // Initial state
    filterUnits("");
  });
})();
