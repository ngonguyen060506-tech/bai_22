(() => {
  const THEME_KEY = "nn-portfolio-theme";
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const themeLabel = document.getElementById("theme-label");

  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.textContent = "☀️";
      if (themeLabel) themeLabel.textContent = "Sáng";
    } else {
      root.removeAttribute("data-theme");
      if (themeIcon) themeIcon.textContent = "🌙";
      if (themeLabel) themeLabel.textContent = "Tối";
    }
  }

  let currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, currentTheme);
      applyTheme(currentTheme);
    });
  }

  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showElement(el) {
    el.classList.add("is-visible");
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(showElement);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showElement(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px 80px 0px",
    }
  );

  function checkVisibleOnScreen() {
    revealEls.forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 60) {
          showElement(el);
          observer.unobserve(el);
        }
      }
    });
  }

  revealEls.forEach((el) => observer.observe(el));
  checkVisibleOnScreen();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      target.querySelectorAll(".reveal").forEach((el) => {
        showElement(el);
        observer.unobserve(el);
      });
    });
  });

  window.addEventListener("scroll", checkVisibleOnScreen, { passive: true });
})();