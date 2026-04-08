const API_KEY = "343c66a344734376a0e964a8edb3e27b";

const root = document.getElementById("root");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortSelect = document.getElementById("sortSelect");
const statsBar = document.getElementById("statsBar");
const themeToggle = document.getElementById("themeToggle");

let allArticles = [];
let likes = {};
let favourites = {};
let activeFilter = "all";

function buildUrl(query) {
  return `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&pageSize=100&language=en`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function showLoader(state) {
  loader.classList.toggle("hidden", !state);
}

function showError(state, message = "⚠️ Failed to load news. Please check your connection or try again later.") {
  errorMsg.textContent = message;
  errorMsg.classList.toggle("hidden", !state);
}

function getProcessedArticles() {
  const query = searchInput.value.trim().toLowerCase();

  const searched = allArticles.filter((art) =>
    [art.title, art.description, art.source?.name]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(query))
  );

  const sortValue = sortSelect.value;
  const sorted = searched.sort((a, b) => {
    if (sortValue === "newest") return new Date(b.publishedAt) - new Date(a.publishedAt);
    if (sortValue === "oldest") return new Date(a.publishedAt) - new Date(b.publishedAt);
    if (sortValue === "alpha-asc") return (a.title || "").localeCompare(b.title || "");
    if (sortValue === "alpha-desc") return (b.title || "").localeCompare(a.title || "");
    return 0;
  });

  const filtered = sorted.filter((art) => {
    const id = art.url;
    if (activeFilter === "liked") return !!likes[id];
    if (activeFilter === "favourited") return !!favourites[id];
    return true;
  });

  return filtered;
}

function buildCard(art) {
  const id = art.url;
  const isLiked = !!likes[id];
  const isFav = !!favourites[id];

  const div = document.createElement("div");
  div.className = "article";

  const imageHTML = art.urlToImage
    ? `<img class="article-image" src="${art.urlToImage}" alt="${art.title || ""}" loading="lazy" onerror="this.outerHTML='<div class=image-placeholder>📰</div>'" />`
    : `<div class="image-placeholder">📰</div>`;

  div.innerHTML = `
    ${imageHTML}
    <div class="article-body">
      <span class="article-source">${art.source?.name || "Unknown"}</span>
      <p class="article-title">${art.title || "No title"}</p>
      <p class="article-desc">${art.description || "No description available."}</p>
      <span class="article-date">${formatDate(art.publishedAt)}</span>
    </div>
    <div class="article-footer">
      <a class="read-more" href="${art.url}" target="_blank" rel="noopener noreferrer">Read More →</a>
      <div class="action-buttons">
        <button class="action-btn like-btn ${isLiked ? "active" : ""}" title="Like">
          ${isLiked ? "❤️ Like" : "🤍 Like"}
        </button>
        <button class="action-btn fav-btn ${isFav ? "active" : ""}" title="Favourite">
          ${isFav ? "⭐" : "☆"}
        </button>
      </div>
    </div>
  `;

  div.querySelector(".like-btn").addEventListener("click", () => {
    likes[id] = !likes[id];
    renderArticles();
  });

  div.querySelector(".fav-btn").addEventListener("click", () => {
    favourites[id] = !favourites[id];
    renderArticles();
  });

  return div;
}

function renderArticles() {
  root.innerHTML = "";
  const articles = getProcessedArticles();

  const likedCount = allArticles.filter((a) => likes[a.url]).length;
  const favCount = allArticles.filter((a) => favourites[a.url]).length;

  statsBar.textContent = `${articles.length} article${articles.length !== 1 ? "s" : ""} shown out of ${allArticles.length} total · ❤️ ${likedCount} liked · ⭐ ${favCount} favourited`;

  if (articles.length === 0) {
    root.innerHTML = `<p class="no-results">📭 No articles found. Try a different keyword or clear filters.</p>`;
    return;
  }

  articles
    .map((art, i) => {
      const card = buildCard(art);
      card.style.animationDelay = `${Math.min(i * 0.03, 0.4)}s`;
      return card;
    })
    .forEach((card) => root.appendChild(card));
}

function loadNews(query) {
  showLoader(true);
  showError(false);
  root.innerHTML = "";
  statsBar.textContent = "🔄 Fetching latest technology news (up to 100 articles)...";

  const fullUrl = buildUrl(query);

  fetch(fullUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      showLoader(false);
      if (data.status !== "ok" || !data.articles) {
        throw new Error("Bad API response: " + (data.message || "unknown error"));
      }
      allArticles = data.articles.filter(
        (art) => art.title && art.title !== "[Removed]" && art.title !== null
      );
      likes = {};
      favourites = {};
      activeFilter = "all";
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.dataset.filter === "all") btn.classList.add("active");
      });
      searchInput.value = "";
      renderArticles();
      console.log(`Loaded ${allArticles.length} articles (API returned ${data.articles.length} total)`);
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      showLoader(false);
      let errorMessage = "⚠️ Failed to load articles. ";
      if (error.message.includes("CORS") || error.message.includes("blocked")) {
        errorMessage += "CORS policy blocked the request. Try using a CORS proxy or run this on a server with proper headers.";
      } else {
        errorMessage += error.message;
      }
      showError(true, errorMessage);
      statsBar.textContent = "⚠️ Failed to load articles. Check console for details.";
    });
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (allArticles.length > 0) renderArticles();
  }
});

searchInput.addEventListener("input", () => {
  if (allArticles.length > 0) renderArticles();
});

searchBtn.addEventListener("click", () => {
  if (allArticles.length > 0) renderArticles();
});

sortSelect.addEventListener("change", () => {
  renderArticles();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    activeFilter = this.dataset.filter;
    renderArticles();
  });
});

themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  themeToggle.textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";
});

loadNews("technology");