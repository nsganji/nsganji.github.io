/* Progressive enhancement for a PatternFly CSS-only site. No dependencies.
   Every feature is guarded so pages without the markup do not throw. */
(function () {
  "use strict";
  // Mobile navigation toggle
  var navToggle = document.querySelector(".site-nav-toggle");
  var nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };
    navToggle.addEventListener("click", function () { setNav(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); navToggle.focus(); }
    });
  }

  // Scroll-spy: highlight the nav link of the section in view (home page only)
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.dataset.section] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("pf-m-current"); a.removeAttribute("aria-current"); });
        var a = byId[entry.target.id];
        if (a) { a.classList.add("pf-m-current"); a.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Back-to-top visibility
  var backToTop = document.querySelector(".site-back-to-top");
  if (backToTop) {
    var onScroll = function () { backToTop.classList.toggle("pf-m-hidden", window.scrollY < 600); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
