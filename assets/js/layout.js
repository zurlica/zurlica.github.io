(function () {
  const headerPlaceholder = document.getElementById("site-header");
  const footerPlaceholder = document.getElementById("site-footer");

  const currentFile =
    location.pathname.split("/").pop().replace(/\/$/, "") || "index.html";

  const headerHTML = `
<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header" id="siteHeader">
  <div class="container nav">
    <a href="index.html" class="brand" aria-label="ZURLICA home">
  <img
    src="assets/img/logo.svg?v=16"
    alt=""
    class="brand-logo logo-light"
  />
  <img
    src="assets/img/logo-dark.svg?v=16"
    alt=""
    class="brand-logo logo-dark"
  />
  <div class="brand-text">
    <strong>ZURLICA</strong>
    <span>Zanzibar University Research Lab</span>
  </div>
</a>

    <div class="nav-right">
      <nav aria-label="Primary navigation">
        <ul class="nav-links" id="navLinks">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="research.html">Research</a></li>
          <li><a href="postgraduate.html">Postgraduate</a></li>
          <li><a href="publications.html">Publications</a></li>
          <li><a href="team.html">Team</a></li>
          <li><a href="collaboration.html">Collaboration</a></li>
          <li><a href="news.html">News</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>

      <button
        type="button"
        class="theme-toggle"
        id="themeToggle"
        aria-label="Switch theme"
        title="Switch light/dark mode"
      >
        <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>

        <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </button>

      <button
        type="button"
        class="menu-toggle"
        id="menuToggle"
        aria-label="Toggle navigation"
        aria-expanded="false"
        aria-controls="navLinks"
      >
        ☰
      </button>
    </div>
  </div>
</header>
`;

  const footerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <div class="footer-shell">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo-row">
            <img
  src="assets/img/logo-dark.svg?v=16"
  alt="ZURLICA emblem"
  class="footer-logo"
/>

            <div class="footer-identity">
              <p class="footer-kicker">Zanzibar University</p>
              <p class="footer-name">ZURLICA</p>
            </div>
          </div>

          <p class="footer-description">
            Zanzibar University Research Lab for Intelligent Computing and Analytics.
            We advance research, postgraduate training, collaboration, and joint publications
            in Artificial Intelligence, Big Data Analytics, Machine Learning, and Business Intelligence.
          </p>

          <div class="footer-contact">
            <div class="footer-contact-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"></path>
                <path d="m22 6-10 7L2 6"></path>
              </svg>

              <a href="mailto:zurlica@zanvarsity.ac.tz">
                zurlica@zanvarsity.ac.tz
              </a>
            </div>

            <div class="footer-contact-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"></path>
                <circle cx="12" cy="10" r="2.5"></circle>
              </svg>

              <span>
                Zanzibar University: Tunguu, Central District, Zanzibar, P.O. Box 2440, Tanzania.
              </span>
            </div>

            <div class="footer-contact-item">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>

              <span>+255774640188</span>
            </div>
          </div>

          <div class="footer-social" aria-label="ZURLICA social and contact links">
            <a
              href="https://github.com/zurlica"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ZURLICA on GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
            </a>

            <a
              href="https://tz.linkedin.com/company/zanzibar-university-zu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zanzibar University on LinkedIn"
              title="LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
              </svg>
            </a>

            <a
              href="https://x.com/ZUTunguu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zanzibar University on X"
              title="X / Twitter"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>

            <a
              href="mailto:zurlica@zanvarsity.ac.tz"
              aria-label="Email ZURLICA"
              title="Email"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"></path>
                <path d="m22 6-10 7L2 6"></path>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-columns">
          <nav class="footer-column" aria-label="Research links">
            <h3 class="footer-heading">Research</h3>
            <ul class="footer-link-list">
              <li><a href="research.html">Research Themes</a></li>
              <li><a href="research.html#methods">Methods</a></li>
              <li><a href="publications.html">Publications</a></li>
              <li><a href="collaboration.html">Collaboration</a></li>
            </ul>
          </nav>

          <nav class="footer-column" aria-label="Academic links">
            <h3 class="footer-heading">Academics</h3>
            <ul class="footer-link-list">
              <li><a href="postgraduate.html">Postgraduate Opportunities</a></li>
              <li><a href="postgraduate.html#clusters">Research Clusters</a></li>
              <li><a href="postgraduate.html#apply">How to Apply</a></li>
              <li><a href="contact.html">Supervision Enquiry</a></li>
            </ul>
          </nav>

          <nav class="footer-column" aria-label="Laboratory information links">
            <h3 class="footer-heading">Lab Info</h3>
            <ul class="footer-link-list">
              <li><a href="about.html">About ZURLICA</a></li>
              <li><a href="team.html">Team</a></li>
              <li><a href="news.html">News and Events</a></li>
              <li><a href="contact.html">Contact Lab</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          © <span id="year"></span> Zanzibar University.
          ZURLICA is a research laboratory of Zanzibar University.
        </p>

        <div class="footer-legal">
          <a href="about.html">About</a>
          <a href="publications.html">Publications</a>
          <a href="contact.html">Contact</a>
          <a href="accessibility.html">Accessibility</a>
        </div>
      </div>
    </div>
  </div>
</footer>
`;

  function injectLayout() {
    if (headerPlaceholder) {
      headerPlaceholder.outerHTML = headerHTML;
    }

    if (footerPlaceholder) {
      footerPlaceholder.outerHTML = footerHTML;
    }
  }

  function initMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    function closeMenu() {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      navLinks.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
    }

    menuToggle.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      const clickedInsideNav = event.target.closest(".nav-right");
      if (!clickedInsideNav && navLinks.classList.contains("active")) {
        closeMenu();
      }
    });
  }

  function initActiveNav() {
    const links = document.querySelectorAll(".nav-links a");

    links.forEach(link => {
      const href = link.getAttribute("href");

      if (href === currentFile) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initScrollHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 12) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initYear() {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  injectLayout();
  initMobileMenu();
  initActiveNav();
  initScrollHeader();
  initYear();

  if (window.ZURLICA_THEME && window.ZURLICA_THEME.init) {
    window.ZURLICA_THEME.init();
  }
})();
