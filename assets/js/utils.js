window.ZURLICA_UTILS = (function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function fetchJson(path) {
    const url = new URL(path, window.location.href);
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to load ${path} (${response.status})`);
    }

    return response.json();
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function getInitials(name) {
    return String(name || "ZU")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join("");
  }

  return {
    escapeHtml,
    fetchJson,
    debounce,
    formatDate,
    getInitials
  };
})();
