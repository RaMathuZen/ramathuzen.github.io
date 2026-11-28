(() => {
  "use strict";

  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  const status = document.getElementById("search-status");

  if (!input || !results || !status) return;

  const indexUrl = input.dataset.index || "/index.json";
  let posts = [];
  let timer;

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        default: return "&#39;";
      }
    });

  const highlight = (text, query) => {
    if (!query) return escapeHtml(text);
    const at = text.toLowerCase().indexOf(query.toLowerCase());
    if (at === -1) return escapeHtml(text);
    return (
      escapeHtml(text.slice(0, at)) +
      "<mark>" + escapeHtml(text.slice(at, at + query.length)) + "</mark>" +
      escapeHtml(text.slice(at + query.length))
    );
  };

  const snippet = (text, query) => {
    if (!text) return "";
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (!query) {
      return clean.slice(0, 180) + (clean.length > 180 ? "…" : "");
    }
    const at = clean.toLowerCase().indexOf(query.toLowerCase());
    if (at === -1) {
      return clean.slice(0, 180) + (clean.length > 180 ? "…" : "");
    }
    let start = Math.max(0, at - 70);
    const previousSpace = clean.lastIndexOf(" ", start);
    if (previousSpace > 0) start = previousSpace + 1;
    let end = Math.min(clean.length, at + query.length + 110);
    const nextSpace = clean.indexOf(" ", end);
    if (nextSpace > 0) end = nextSpace;
    return (
      (start > 0 ? "…" : "") +
      clean.slice(start, end) +
      (end < clean.length ? "…" : "")
    );
  };

  const score = (post, query) => {
    const q = query.toLowerCase();
    const title = (post.title || "").toLowerCase();
    const tags = (post.tags || []).join(" ").toLowerCase();
    const content = (post.searchText || post.content || "").toLowerCase();
    let value = 0;

    if (title === q) value += 100;
    if (title.includes(q)) value += 40;
    if (tags.includes(q)) value += 15;
    if (content.includes(q)) value += 5;

    return value;
  };

  const render = (query) => {
    const q = query.trim();
    let matches = posts;

    if (q) {
      matches = posts
        .map((post) => ({ post, score: score(post, q) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
        .map((item) => item.post);
    }

    status.textContent = q
      ? `${matches.length} result${matches.length === 1 ? "" : "s"} for “${q}”`
      : `${matches.length} post${matches.length === 1 ? "" : "s"}`;

    if (!matches.length) {
      results.innerHTML = `<p class="muted">No posts found${q ? ` for “${escapeHtml(q)}”` : ""}.</p>`;
      return;
    }

    results.innerHTML = `<ul class="search-results-list">${matches.map((post) => {
      const label = post.section === "tils" ? "TIL" : "Blog";
      const tags = (post.tags || []).map((tag) => "#" + escapeHtml(tag)).join(" ");
      const meta = [label, tags].filter(Boolean).join(" · ");
      const date = post.dateDisplay || post.date;
      return `
        <li class="search-result">
          <time datetime="${escapeHtml(post.date)}">${escapeHtml(date)}</time>
          <div>
            <a class="search-result-title" href="${escapeHtml(post.url)}">${highlight(post.title, q)}</a>
            <p class="search-result-meta">${meta}</p>
            ${q ? `<p class="search-result-snippet">${highlight(snippet(post.content, q), q)}</p>` : ""}
          </div>
        </li>`;
    }).join("")}</ul>`;
  };

  const syncUrl = () => {
    const url = new URL(window.location.href);
    const value = input.value.trim();
    if (value) {
      url.searchParams.set("q", value);
    } else {
      url.searchParams.delete("q");
    }
    history.replaceState(null, "", url);
  };

  const update = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      render(input.value);
      syncUrl();
    }, 100);
  };

  fetch(indexUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      posts = Array.isArray(data) ? data : [];
      const initial = new URLSearchParams(window.location.search).get("q");
      if (initial) input.value = initial;
      render(input.value);
    })
    .catch(() => {
      status.textContent = "Search is unavailable right now.";
      results.innerHTML = `<p class="muted">Browse <a href="${escapeHtml(input.dataset.blogs || "/blogs/")}">blogs</a> or <a href="${escapeHtml(input.dataset.tils || "/tils/")}">TILs</a> instead.</p>`;
    });

  input.addEventListener("input", update);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      input.value = "";
      render("");
      syncUrl();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      render(input.value);
      syncUrl();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== input) {
      event.preventDefault();
      input.focus();
    }
  });
})();
