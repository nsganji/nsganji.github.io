/* Design-system enhancements: reveal-on-scroll, stat count-up, code copy.
   Vanilla, guarded, no dependencies. Everything degrades to static content. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  // Reveal-on-scroll: .site-reveal elements fade up once, then stop observing
  var reveals = document.querySelectorAll(".site-reveal");
  if (reveals.length) {
    if (reduce || !hasIO) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); revealIO.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px" });
      reveals.forEach(function (el) { revealIO.observe(el); });
    }
  }

  // Stat count-up: animates the leading integer of [data-count-up] ("250+" -> 0..250 + "+").
  // Non-numeric values (e.g. placeholders) are left untouched.
  var counters = document.querySelectorAll("[data-count-up]");
  if (counters.length && !reduce && hasIO) {
    var run = function (el) {
      var m = el.textContent.trim().match(/^(\D*)(\d[\d,]*)(.*)$/);
      if (!m) return;
      var target = parseInt(m[2].replace(/,/g, ""), 10), start = null, dur = 1200;
      var step = function (t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = m[1] + Math.round(target * eased).toLocaleString() + m[3];
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); countIO.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }

  // Code block copy buttons (.site-code__copy inside .site-code)
  if (navigator.clipboard) {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".site-code__copy");
      if (!btn) return;
      var code = btn.closest(".site-code").querySelector("pre code, pre");
      navigator.clipboard.writeText(code.innerText.replace(/\n$/, "")).then(function () {
        var label = btn.getAttribute("aria-label");
        btn.classList.add("is-copied");
        btn.setAttribute("aria-label", "Copied");
        setTimeout(function () { btn.classList.remove("is-copied"); btn.setAttribute("aria-label", label); }, 2000);
      });
    });
  } else {
    document.querySelectorAll(".site-code__copy").forEach(function (b) { b.hidden = true; });
  }
})();
