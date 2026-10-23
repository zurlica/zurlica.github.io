(function () {
  const utils = window.ZURLICA_UTILS || {};

  const escapeHtml =
    utils.escapeHtml ||
    function (value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

  const fetchJson =
    utils.fetchJson ||
    async function (path) {
      const url = new URL(path, window.location.href);
      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Unable to load ${path} (${response.status})`);
      }

      return response.json();
    };

  const debounce =
    utils.debounce ||
    function (fn, delay) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    };

  const getInitials =
    utils.getInitials ||
    function (name) {
      const titlePattern =
        /^(prof\.?|professor|dr\.?|doctor|mr\.?|ms\.?|mrs\.?|miss|eng\.?|engineer|ass\.?|assoc\.?|associate|ir\.?|hon\.?|rev\.?|fr\.?|sr\.?|jr\.?)$/i;

      const words = String(name || "")
        .split(/\s+/)
        .filter(Boolean)
        .filter(word => {
          const clean = word.replace(/[^A-Za-z.]/g, "");
          return clean && !titlePattern.test(clean);
        });

      const initials = words
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");

      return initials || "ZU";
    };

  const teamGrid = document.getElementById("teamGrid");
  const teamStatus = document.getElementById("teamStatus");
  const teamFilters = document.getElementById("teamFilters");
  const teamThemeFilter = document.getElementById("teamThemeFilter");
  const teamSearch = document.getElementById("teamSearch");
  const teamStats = document.getElementById("teamStats");

  const modal = document.getElementById("teamModal");
  const modalContent = document.getElementById("teamModalContent");
  const modalClose = document.getElementById("teamModalClose");

  if (!teamGrid || !teamStatus) return;

  let lastFocusedElement = null;

  const state = {
    members: [],
    filtered: [],
    query: "",
    category: "all",
    theme: "all"
  };

  const categoryLabels = {
    all: "All",
    leadership: "Leadership",
    investigators: "Principal Investigators",
    fellows: "Research Fellows",
    students: "Postgraduate Students",
    technical: "Technical Team",
    advisory: "Advisory Board",
    affiliates: "Affiliates",
    alumni: "Alumni"
  };

  const categoryOrder = [
    "leadership",
    "investigators",
    "fellows",
    "students",
    "technical",
    "advisory",
    "affiliates",
    "alumni"
  ];

  function normalizeCategory(category) {
    return String(category || "affiliates").toLowerCase().trim();
  }

  function getCategoryLabel(category) {
    const normalized = normalizeCategory(category);
    return categoryLabels[normalized] || normalized;
  }

  function hasValue(value) {
    return Boolean(value && value !== "#");
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function renderOrgLine(member, isProfile = false) {
    const institution = member.institution || "Zanzibar University";
    const faculty = member.faculty || "";
    const department = member.department || "";

    const prefix = isProfile ? "profile-org" : "org";
    const containerClass = isProfile ? "team-profile-institution" : "team-institution";

    const parts = [];

    if (institution) {
      parts.push(
        `<span class="${prefix}-institution">${escapeHtml(institution)}</span>`
      );
    }

    if (faculty) {
      parts.push(
        `<span class="${prefix}-faculty">${escapeHtml(faculty)}</span>`
      );
    }

    if (department) {
      parts.push(
        `<span class="${prefix}-department">${escapeHtml(department)}</span>`
      );
    }

    return `<p class="${containerClass}">${parts.join("")}</p>`;
  }

  function renderChips(items, className = "profile-chip") {
    const list = toArray(items);

    if (!list.length) {
      return `<p class="profile-empty">Not specified yet.</p>`;
    }

    return `
      <div class="profile-chips">
        ${list
          .map(item => `<span class="${className}">${escapeHtml(item)}</span>`)
          .join("")}
      </div>
    `;
  }

  function renderMiniLinks(member) {
    const links = [];

    if (hasValue(member.email)) {
      links.push(
        `<a class="team-mini-link" href="mailto:${escapeHtml(member.email)}">Email</a>`
      );
    }

    if (hasValue(member.orcid)) {
      links.push(
        `<a class="team-mini-link" href="https://orcid.org/${escapeHtml(member.orcid)}" target="_blank" rel="noopener noreferrer">ORCID</a>`
      );
    }

    if (hasValue(member.scholar)) {
      links.push(
        `<a class="team-mini-link" href="${escapeHtml(member.scholar)}" target="_blank" rel="noopener noreferrer">Scholar</a>`
      );
    }

    if (hasValue(member.github)) {
      links.push(
        `<a class="team-mini-link" href="${escapeHtml(member.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
      );
    }

    if (hasValue(member.linkedin)) {
      links.push(
        `<a class="team-mini-link" href="${escapeHtml(member.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
      );
    }

    if (hasValue(member.website)) {
      links.push(
        `<a class="team-mini-link" href="${escapeHtml(member.website)}" target="_blank" rel="noopener noreferrer">Website</a>`
      );
    }

    if (!links.length) return "";

    return `<div class="team-card-links">${links.join("")}</div>`;
  }

  function renderProfileLinks(member) {
    const links = [];

    if (hasValue(member.email)) {
      links.push(
        `<a class="profile-link" href="mailto:${escapeHtml(member.email)}">Email</a>`
      );
    }

    if (hasValue(member.orcid)) {
      links.push(
        `<a class="profile-link" href="https://orcid.org/${escapeHtml(member.orcid)}" target="_blank" rel="noopener noreferrer">ORCID</a>`
      );
    }

    if (hasValue(member.scholar)) {
      links.push(
        `<a class="profile-link" href="${escapeHtml(member.scholar)}" target="_blank" rel="noopener noreferrer">Google Scholar</a>`
      );
    }

    if (hasValue(member.github)) {
      links.push(
        `<a class="profile-link" href="${escapeHtml(member.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
      );
    }

    if (hasValue(member.linkedin)) {
      links.push(
        `<a class="profile-link" href="${escapeHtml(member.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
      );
    }

    if (hasValue(member.website)) {
      links.push(
        `<a class="profile-link" href="${escapeHtml(member.website)}" target="_blank" rel="noopener noreferrer">Personal Site</a>`
      );
    }

    if (!links.length) return "";

    return `<div class="profile-links">${links.join("")}</div>`;
  }

  function renderProjects(projects) {
    const list = toArray(projects);

    if (!list.length) return "";

    return `
      <section class="profile-section">
        <h3>Current or Recent Projects</h3>
        <ul class="profile-list">
          ${list
            .map(project => {
              if (typeof project === "string") {
                return `<li>${escapeHtml(project)}</li>`;
              }

              const title = project.title || project.name || "Untitled project";
              const description = project.description ? ` — ${project.description}` : "";
              const url = hasValue(project.url)
                ? ` <a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">Details</a>`
                : "";

              return `<li>${escapeHtml(title)}${escapeHtml(description)}${url}</li>`;
            })
            .join("")}
        </ul>
      </section>
    `;
  }

  function renderPublications(publications) {
    const list = toArray(publications);

    if (!list.length) return "";

    return `
      <section class="profile-section">
        <h3>Selected Publications</h3>
        <ul class="profile-list">
          ${list
            .map(pub => {
              if (typeof pub === "string") {
                return `<li>${escapeHtml(pub)}</li>`;
              }

              const title = pub.title || "Untitled publication";
              const year = pub.year ? ` (${escapeHtml(pub.year)})` : "";
              const venue = pub.venue ? `. ${escapeHtml(pub.venue)}` : "";
              const url = hasValue(pub.url)
                ? ` <a href="${escapeHtml(pub.url)}" target="_blank" rel="noopener noreferrer">Link</a>`
                : "";
              const doi = hasValue(pub.doi)
                ? ` <a href="https://doi.org/${escapeHtml(pub.doi)}" target="_blank" rel="noopener noreferrer">DOI</a>`
                : "";

              return `<li>${escapeHtml(title)}${year}${venue}${url}${doi}</li>`;
            })
            .join("")}
        </ul>
      </section>
    `;
  }

  function renderEducation(education) {
    const list = toArray(education);

    if (!list.length) return "";

    return `
      <section class="profile-section">
        <h3>Education</h3>
        <ul class="profile-list">
          ${list.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function renderCard(member) {
    const interests = toArray(member.interests);
    const visibleInterests = interests.slice(0, 3);
    const extraCount = interests.length > 3 ? interests.length - 3 : 0;

    const photoHtml = hasValue(member.image)
      ? `
        <img
          class="team-photo-img"
          src="${escapeHtml(member.image)}"
          alt="${escapeHtml(member.imageAlt || `Photo of ${member.name}`)}"
          loading="lazy"
        />
      `
      : "";

    return `
      <article class="team-card">
        <div class="team-photo">
          <span class="team-category-badge">${escapeHtml(getCategoryLabel(member.category))}</span>

          ${member.status ? `<span class="team-status-badge">${escapeHtml(member.status)}</span>` : ""}

          ${photoHtml}

          <div class="team-photo-initials" aria-hidden="true">
            ${escapeHtml(getInitials(member.name))}
          </div>
        </div>

        <div class="team-body">
          <h3 class="team-name">${escapeHtml(member.name)}</h3>
          <p class="team-role">${escapeHtml(member.role)}</p>

          ${renderOrgLine(member, false)}

          ${member.shortBio ? `<p class="team-short-bio">${escapeHtml(member.shortBio)}</p>` : ""}

          ${
            visibleInterests.length
              ? `
                <div class="team-interests">
                  ${visibleInterests
                    .map(interest => `<span class="team-interest">${escapeHtml(interest)}</span>`)
                    .join("")}
                  ${extraCount ? `<span class="team-more">+${extraCount}</span>` : ""}
                </div>
              `
              : ""
          }

          ${renderMiniLinks(member)}

          <button
            type="button"
            class="btn btn-secondary team-view-btn"
            data-profile-id="${escapeHtml(member.id)}"
          >
            View Profile
          </button>
        </div>
      </article>
    `;
  }

  function renderProfile(member) {
    const themes = toArray(member.themes);
    const interests = toArray(member.interests);

    const photoHtml = hasValue(member.image)
      ? `
        <img
          class="team-profile-img"
          src="${escapeHtml(member.image)}"
          alt="${escapeHtml(member.imageAlt || `Photo of ${member.name}`)}"
        />
      `
      : "";

    return `
      <aside class="team-profile-media">
        <div class="team-profile-photo">
          ${photoHtml}
          <div class="team-profile-initials" aria-hidden="true">
            ${escapeHtml(getInitials(member.name))}
          </div>
        </div>

        <div class="team-profile-meta">
          ${member.status ? `<span class="profile-badge">${escapeHtml(member.status)}</span>` : ""}
          ${member.pronouns ? `<span class="profile-pronouns">${escapeHtml(member.pronouns)}</span>` : ""}
        </div>

        ${renderProfileLinks(member)}
      </aside>

      <div class="team-profile-details">
        <div class="team-profile-header">
          <p class="team-profile-kicker">${escapeHtml(getCategoryLabel(member.category))}</p>
          <h2 id="teamModalTitle">${escapeHtml(member.name)}</h2>
          <p class="team-profile-role">${escapeHtml(member.role)}</p>

          ${renderOrgLine(member, true)}
        </div>

        ${
          member.fullBio || member.shortBio
            ? `
              <section class="profile-section">
                <h3>About</h3>
                <p>${escapeHtml(member.fullBio || member.shortBio)}</p>
              </section>
            `
            : ""
        }

        ${
          member.office
            ? `
              <section class="profile-section">
                <h3>Office / Location</h3>
                <p>${escapeHtml(member.office)}</p>
              </section>
            `
            : ""
        }

        ${
          themes.length
            ? `
              <section class="profile-section">
                <h3>ZURLICA Research Themes</h3>
                ${renderChips(themes)}
              </section>
            `
            : ""
        }

        ${
          interests.length
            ? `
              <section class="profile-section">
                <h3>Research Interests</h3>
                ${renderChips(interests)}
              </section>
            `
            : ""
        }

        ${renderProjects(member.projects)}
        ${renderPublications(member.publications)}
        ${renderEducation(member.education)}
      </div>
    `;
  }

  function attachImageFallback(container, selector, parentSelector) {
    container.querySelectorAll(selector).forEach(img => {
      img.addEventListener("error", () => {
        const parent = img.closest(parentSelector);
        if (parent) parent.classList.add("photo-missing");
      });
    });
  }

  function renderTeam() {
    if (!state.filtered.length) {
      teamGrid.innerHTML = `
        <div class="empty-state">
          No team members match your current search or filter.
        </div>
      `;

      teamStatus.textContent = "0 team members shown.";
      return;
    }

    teamGrid.innerHTML = state.filtered.map(renderCard).join("");

    attachImageFallback(teamGrid, ".team-photo-img", ".team-photo");

    const total = state.members.length;
    const shown = state.filtered.length;

    teamStatus.textContent =
      shown === total
        ? `${shown} team member${shown === 1 ? "" : "s"} loaded.`
        : `${shown} of ${total} team members shown.`;
  }

  function renderStats() {
    if (!teamStats) return;

    const total = state.members.length;

    const leadership = state.members.filter(
      m => normalizeCategory(m.category) === "leadership"
    ).length;

    const investigators = state.members.filter(
      m => normalizeCategory(m.category) === "investigators"
    ).length;

    const students = state.members.filter(
      m => normalizeCategory(m.category) === "students"
    ).length;

    const partners = state.members.filter(m =>
      ["advisory", "affiliates", "fellows"].includes(normalizeCategory(m.category))
    ).length;

    const stats = [
      { label: "Total team members", value: total },
      { label: "Leadership and investigators", value: leadership + investigators },
      { label: "Postgraduate students", value: students },
      { label: "Fellows and advisors", value: partners }
    ];

    teamStats.innerHTML = stats
      .map(
        stat => `
          <div class="team-stat">
            <strong>${escapeHtml(stat.value)}</strong>
            <span>${escapeHtml(stat.label)}</span>
          </div>
        `
      )
      .join("");
  }

  function buildCategoryFilters() {
    if (!teamFilters) return;

    const orderIndex = category => {
      const index = categoryOrder.indexOf(category);
      return index === -1 ? 999 : index;
    };

    const presentCategories = [
      ...new Set(state.members.map(member => normalizeCategory(member.category)))
    ].sort((a, b) => orderIndex(a) - orderIndex(b));

    const categories = ["all", ...presentCategories];

    teamFilters.innerHTML = categories
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

    teamFilters.querySelectorAll(".filter-btn").forEach(button => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category;

        teamFilters.querySelectorAll(".filter-btn").forEach(btn => {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        applyFilters();
      });
    });
  }

  function buildThemeFilter() {
    if (!teamThemeFilter) return;

    const themes = [
      ...new Set(
        state.members
          .flatMap(member => toArray(member.themes))
          .filter(Boolean)
      )
    ].sort((a, b) => a.localeCompare(b));

    teamThemeFilter.innerHTML = `
      <option value="all">All themes</option>
      ${themes
        .map(theme => `<option value="${escapeHtml(theme)}">${escapeHtml(theme)}</option>`)
        .join("")}
    `;

    teamThemeFilter.addEventListener("change", () => {
      state.theme = teamThemeFilter.value;
      applyFilters();
    });
  }

  function applyFilters() {
    const query = state.query.toLowerCase().trim();

    state.filtered = state.members.filter(member => {
      const memberCategory = normalizeCategory(member.category);

      const matchesCategory =
        state.category === "all" || memberCategory === state.category;

      const memberThemes = toArray(member.themes);
      const matchesTheme =
        state.theme === "all" || memberThemes.includes(state.theme);

      const searchableText = [
        member.name,
        member.role,
        member.institution,
        member.faculty,
        member.department,
        member.shortBio,
        member.fullBio,
        member.status,
        toArray(member.interests).join(" "),
        memberThemes.join(" "),
        toArray(member.projects)
          .map(project =>
            typeof project === "string"
              ? project
              : `${project.title || ""} ${project.description || ""}`
          )
          .join(" "),
        toArray(member.publications)
          .map(pub =>
            typeof pub === "string"
              ? pub
              : `${pub.title || ""} ${pub.venue || ""}`
          )
          .join(" ")
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || searchableText.includes(query);

      return matchesCategory && matchesTheme && matchesQuery;
    });

    renderTeam();
  }

  function openProfile(memberId) {
    const member = state.members.find(item => String(item.id) === String(memberId));
    if (!member || !modal || !modalContent) return;

    lastFocusedElement = document.activeElement;

    modalContent.innerHTML = renderProfile(member);
    attachImageFallback(modalContent, ".team-profile-img", ".team-profile-photo");

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
      modal.classList.add("open");
      if (modalClose) modalClose.focus();
    });
  }

  function closeProfile() {
    if (!modal || modal.hidden) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    window.setTimeout(() => {
      modal.hidden = true;
      modalContent.innerHTML = "";

      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    }, 180);
  }

  function trapFocus(event) {
    if (!modal || modal.hidden) return;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea",
      "input",
      "select",
      "[tabindex]:not([tabindex='-1'])"
    ];

    const focusableElements = Array.from(
      modal.querySelectorAll(focusableSelectors.join(","))
    ).filter(el => el.offsetParent !== null);

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function initEvents() {
    if (teamGrid) {
      teamGrid.addEventListener("click", event => {
        const button = event.target.closest("[data-profile-id]");
        if (button) {
          openProfile(button.dataset.profileId);
        }
      });
    }

    if (teamSearch) {
      teamSearch.addEventListener(
        "input",
        debounce(event => {
          state.query = event.target.value;
          applyFilters();
        }, 220)
      );
    }

    if (modalClose) {
      modalClose.addEventListener("click", closeProfile);
    }

    if (modal) {
      modal.addEventListener("click", event => {
        if (event.target.matches("[data-close-team-modal]")) {
          closeProfile();
        }
      });
    }

    document.addEventListener("keydown", event => {
      if (!modal || modal.hidden) return;

      if (event.key === "Escape") {
        closeProfile();
      }

      if (event.key === "Tab") {
        trapFocus(event);
      }
    });
  }

  async function loadTeam() {
    const candidates = [
      document.body.dataset.teamData,
      "assets/data/team.json",
      "./assets/data/team.json",
      "../assets/data/team.json",
      "/assets/data/team.json"
    ].filter(Boolean);

    const attempts = [];

    if (teamStatus) {
      teamStatus.textContent = "Loading team data from local JSON...";
    }

    for (const candidate of candidates) {
      try {
        const separator = candidate.includes("?") ? "&" : "?";
        const url = `${candidate}${separator}_=${Date.now()}`;

        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          attempts.push(`${candidate}: HTTP ${response.status}`);
          continue;
        }

        const text = await response.text();

        try {
          const data = JSON.parse(text);

          const members = Array.isArray(data)
            ? data
            : Array.isArray(data.team)
              ? data.team
              : null;

          if (!Array.isArray(members)) {
            throw new Error(
              'JSON loaded, but no team array was found. Expected { "team": [...] } or a direct array.'
            );
          }

          state.members = members;

          renderStats();
          buildCategoryFilters();
          buildThemeFilter();
          applyFilters();

          return;
        } catch (parseError) {
          attempts.push(`${candidate}: Invalid JSON — ${parseError.message}`);
          console.error("ZURLICA JSON parse error:", parseError);
        }
      } catch (networkError) {
        attempts.push(`${candidate}: Network error — ${networkError.message}`);
        console.error("ZURLICA network error:", networkError);
      }
    }

    console.error("ZURLICA team load attempts:", attempts);

    if (teamStatus) {
      teamStatus.textContent = "Could not load team data.";
    }

    if (teamGrid) {
      teamGrid.innerHTML = `
        <div class="empty-state">
          <h3>Team data could not be loaded</h3>
          <p>ZURLICA tried these locations:</p>
          <ul>
            ${attempts.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
          <p>
            Please check that <code>assets/data/team.json</code> exists, is spelled in lower case,
            contains valid JSON, and is served through a local server such as
            VS Code Live Server or Python http.server.
          </p>
        </div>
      `;
    }
  }

  initEvents();
  loadTeam();
})();
