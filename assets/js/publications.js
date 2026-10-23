(function () {
  const { escapeHtml, fetchJson, debounce } = window.ZURLICA_UTILS;

  const pubList = document.getElementById("pubList");
  const pubStatus = document.getElementById("pubStatus");
  const pubSearch = document.getElementById("pubSearch");
  const pubTypeFilters = document.getElementById("pubTypeFilters");
  const pubYearFilter = document.getElementById("pubYearFilter");

  if (!pubList || !pubStatus) return;

  const state = {
    publications: [],
    filtered: [],
    query: "",
    type: "all",
    year: "all"
  };

  const typeLabels = {
    all: "All",
    journal: "Journal",
    conference: "Conference",
    preprint: "Preprint",
    dataset: "Dataset",
    software: "Software",
    report: "Report",
    policy: "Policy",
    thesis: "Thesis"
  };

  function normalizeType(type) {
    return String(type || "report").toLowerCase().trim();
  }

  function getTypeLabel(type) {
    const normalized = normalizeType(type);
    return (
      typeLabels[normalized] ||
      normalized.charAt(0).toUpperCase() + normalized.slice(1)
    );
  }

  function applyFilters() {
    const query = state.query.toLowerCase().trim();

    state.filtered = state.publications.filter(pub => {
      const matchesType =
        state.type === "all" || normalizeType(pub.type) === state.type;

      const matchesYear =
        state.year === "all" || String(pub.year) === state.year;

      const searchableText = [
        pub.title,
        Array.isArray(pub.authors) ? pub.authors.join(" ") : pub.authors,
        pub.venue,
        pub.year,
        pub.type,
        Array.isArray(pub.tags) ? pub.tags.join(" ") : pub.tags,
        pub.abstract
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || searchableText.includes(query);

      return matchesType && matchesYear && matchesQuery;
    });

    renderPublications();
  }

  function buildTypeFilters() {
    if (!pubTypeFilters) return;

    const types = [
      "all",
      ...new Set(state.publications.map(pub => normalizeType(pub.type)))
    ];

    pubTypeFilters.innerHTML = types
      .map(type => {
        const activeClass = type === state.type ? "active" : "";
        return `
          <button
            type="button"
            class="filter-btn ${activeClass}"
            data-type="${escapeHtml(type)}"
            aria-pressed="${type === state.type ? "true" : "false"}"
          >
            ${escapeHtml(getTypeLabel(type))}
          </button>
        `;
      })
      .join("");

    pubTypeFilters.querySelectorAll(".filter-btn").forEach(button => {
      button.addEventListener("click", () => {
        state.type = button.dataset.type;

        pubTypeFilters.querySelectorAll(".filter-btn").forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        applyFilters();
      });
    });
  }

  function buildYearFilter() {
    if (!pubYearFilter) return;

    const years = [...new Set(state.publications.map(pub => pub.year))]
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a));

    pubYearFilter.innerHTML = `
      <option value="all">All years</option>
      ${years
        .map(
          year =>
            `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`
        )
        .join("")}
    `;

    pubYearFilter.addEventListener("change", () => {
      state.year = pubYearFilter.value;
      applyFilters();
    });
  }

  function renderLinks(pub) {
    const links = [];

    if (pub.url && pub.url !== "#") {
      links.push(
        `<a class="pub-link" href="${escapeHtml(pub.url)}" target="_blank" rel="noopener noreferrer">Paper / Page</a>`
      );
    }

    if (pub.doi) {
      links.push(
        `<a class="pub-link" href="https://doi.org/${escapeHtml(pub.doi)}" target="_blank" rel="noopener noreferrer">DOI</a>`
      );
    }

    if (pub.pdf && pub.pdf !== "#") {
      links.push(
        `<a class="pub-link" href="${escapeHtml(pub.pdf)}" target="_blank" rel="noopener noreferrer">PDF</a>`
      );
    }

    if (pub.code && pub.code !== "#") {
      links.push(
        `<a class="pub-link" href="${escapeHtml(pub.code)}" target="_blank" rel="noopener noreferrer">Code</a>`
      );
    }

    if (pub.dataset && pub.dataset !== "#") {
      links.push(
        `<a class="pub-link" href="${escapeHtml(pub.dataset)}" target="_blank" rel="noopener noreferrer">Dataset</a>`
      );
    }

    if (!links.length) return "";

    return `<div class="pub-links">${links.join("")}</div>`;
  }

  function renderPublications() {
    if (!state.filtered.length) {
      pubList.innerHTML = `
        <div class="empty-state">
          No publications match your current search or filter.
        </div>
      `;

      pubStatus.textContent = "0 publications shown.";
      return;
    }

    pubList.innerHTML = state.filtered
      .map(pub => {
        const authors = Array.isArray(pub.authors)
          ? pub.authors.join(", ")
          : pub.authors || "ZURLICA Researchers";

        const tags = Array.isArray(pub.tags) ? pub.tags : [];
        const status = pub.status
          ? `<span class="pub-badge">${escapeHtml(pub.status)}</span>`
          : "";

        return `
          <article class="publication-card">
            <div class="pub-top">
              <span class="pub-badge">${escapeHtml(getTypeLabel(pub.type))}</span>
              <span class="pub-year">${escapeHtml(pub.year || "")}</span>
            </div>

            <h3>${escapeHtml(pub.title)}</h3>

            <p class="pub-authors"><strong>Authors:</strong> ${escapeHtml(authors)}</p>

            ${pub.venue ? `<p class="pub-venue"><strong>Venue:</strong> ${escapeHtml(pub.venue)}</p>` : ""}

            ${pub.abstract ? `<p class="pub-abstract">${escapeHtml(pub.abstract)}</p>` : ""}

            ${status ? `<div>${status}</div>` : ""}

            ${
              tags.length
                ? `
              <div class="pub-tags">
                ${tags
                  .map(tag => `<span class="pub-tag">${escapeHtml(tag)}</span>`)
                  .join("")}
              </div>
            `
                : ""
            }

            ${renderLinks(pub)}
          </article>
        `;
      })
      .join("");

    const total = state.publications.length;
    const shown = state.filtered.length;

    pubStatus.textContent =
      shown === total
        ? `${shown} publication${shown === 1 ? "" : "s"} loaded.`
        : `${shown} of ${total} publications shown.`;
  }

  async function loadPublications() {
    try {
      const data = await fetchJson("assets/data/publications.json");
      state.publications = Array.isArray(data.publications)
        ? data.publications
        : [];

      buildTypeFilters();
      buildYearFilter();
      applyFilters();
    } catch (error) {
      console.error(error);
      pubStatus.textContent =
        "Could not load publications. Please check assets/data/publications.json.";

      pubList.innerHTML = `
        <div class="empty-state">
          Publications data could not be loaded. If you are testing locally,
          serve the site using a local server such as VS Code Live Server.
        </div>
      `;
    }
  }

  if (pubSearch) {
    pubSearch.addEventListener(
      "input",
      debounce(event => {
        state.query = event.target.value;
        applyFilters();
      }, 220)
    );
  }

  loadPublications();
})();
