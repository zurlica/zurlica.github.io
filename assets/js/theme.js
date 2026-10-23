(function () {
  const STORAGE_KEY = "zurlica-theme";
  const root = document.documentElement;

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    } catch (error) {
      // Ignore localStorage errors.
    }

    return null;
  }

  function getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  }

  function updateToggleButton(theme) {
    const button = document.getElementById("themeToggle");
    if (!button) return;

    const isDark = theme === "dark";

    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    button.setAttribute(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    button.setAttribute("aria-pressed", isDark ? "true" : "false");
  }

  function applyTheme(theme) {
    const safeTheme = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", safeTheme);
    root.style.colorScheme = safeTheme;
    updateToggleButton(safeTheme);
  }

  function toggleTheme() {
    const currentTheme =
      root.getAttribute("data-theme") || getStoredTheme() || getSystemTheme();

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (error) {
      // Ignore localStorage errors.
    }
  }

  function initThemeControls() {
    const button = document.getElementById("themeToggle");
    if (!button) return;

    if (button.dataset.themeBound === "true") return;

    button.dataset.themeBound = "true";
    button.type = "button";
    button.addEventListener("click", toggleTheme);

    updateToggleButton(root.getAttribute("data-theme") || getSystemTheme());
  }

  const initialTheme = getStoredTheme() || getSystemTheme();
  applyTheme(initialTheme);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeControls);
  } else {
    initThemeControls();
  }

  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange(event) {
      const storedTheme = getStoredTheme();

      if (!storedTheme) {
        applyTheme(event.matches ? "dark" : "light");
      }
    }

    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener("change", handleSystemThemeChange);
    } else if (darkModeQuery.addListener) {
      darkModeQuery.addListener(handleSystemThemeChange);
    }
  }

  window.ZURLICA_THEME = {
    init: initThemeControls,
    apply: applyTheme,
    toggle: toggleTheme
  };
})();
