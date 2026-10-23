(function () {
  const { escapeHtml, fetchJson, formatDate } = window.ZURLICA_UTILS;

  const newsList = document.getElementById("newsList");
  const newsStatus = document.getElementById("newsStatus");
  const newsFilters = document.getElementById("newsFilters");

  if (!newsList || !newsStatus) return;

  const state = {
    items: [],
    filtered: [],
    category: "all"
  };

  const categoryLabels = {
    all: "All",
    announcement: "Announcement",
    publication: "Publication",
    event: "Event",
    partnership: "Partnership",
    student: "Student",
    funding: "Funding",
    dataset: "Dataset"
  };

  function getCategoryLabel(category) {
    return categoryLabels[category] || category;
  }

  function sortByDateDesc(a, b) {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  }

  function applyFilters() {
    state.filtered =
      state.category === "all"
        ? [...state.items]
        : state.items.filter(item => item.category === state.category);

    state.filtered.sort(sortByDateDesc);
    renderNews();
  }

  function buildFilters() {
    if (!newsFilters) return;

    const categories = [
      "all",
      ...new Set(state.items.map(item => item.category).filter(Boolean))
    ];

    newsFilters.innerHTML = categories
      .map(category => {
        const activeClass = category === state.category ? "active" : "";
        return `
          <button
            type="button"
            class="filter-btn ${activeClass}"
            data-category="${escapeHtml(category)}"
            aria-pressed="${category === state.category ? "true" : "false"}"
          >
            ${escapeHtml(getCategoryLabel(category))}
          </button>
        `;
      })
      .join("");

    newsFilters.querySelectorAll(".filter-btn").forEach(button => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category;

        newsFilters.querySelectorAll(".filter-btn").forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        applyFilters();
      });
    });
  }

  function renderNews() {
    if (!state.filtered.length) {
      newsList.innerHTML = `
        <div class="empty-state">
          No news items found for this category.
        </div>
      `;

      newsStatus.textContent = "0 news items shown.";
      return;
    }

    newsList.innerHTML = state.filtered
      .map(item => {
        const link =
          item.url && item.url !== "#"
            ? `<a class="news-link" href="${escapeHtml(item.url)}">Read more</a>`
            : "";

        return `
          <article class="news-item">
            <div class="news-date">
              <span class="news-date-dot" aria-hidden="true"></span>
              <time datetime="${escapeHtml(item.date || "")}">
                ${escapeHtml(formatDate(item.date))}
              </time>
            </div>

            <div class="news-card">
              <span class="news-category">
                ${escapeHtml(getCategoryLabel(item.category))}
              </span>

              <h3>${escapeHtml(item.title)}</h3>

              ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}

              ${link}
            </div>
          </article>
        `;
      })
      .join("");

    const total = state.items.length;
    const shown = state.filtered.length;

    newsStatus.textContent =
      shown === total
        ? `${shown} news item${shown === 1 ? "" : "s"} loaded.`
        : `${shown} of ${total} news items shown.`;
  }

  async function loadNews() {
    try {
      const data = await fetchJson("assets/data/news.json");
      state.items = Array.isArray(data.news) ? data.news : [];

      state.items.sort(sortByDateDesc);

      buildFilters();
      applyFilters();
    } catch (error) {
      console.error(error);
      newsStatus.textContent =
        "Could not load news data. Please check assets/data/news.json.";

      newsList.innerHTML = `
        <div class="empty-state">
          News data could not be loaded. If you are testing locally,
          serve the site using a local server such as VS Code Live Server.
        </div>
      `;
    }
  }

  loadNews();
})();
