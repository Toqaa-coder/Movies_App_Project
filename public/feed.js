const TOKEN = localStorage.getItem('token');

// Guard — must be logged in
if (!TOKEN) window.location.href = '/';

/* ── Show active persona name in navbar ── */
const persona = JSON.parse(sessionStorage.getItem('persona') || '{}');
const avatarEl = document.getElementById('nav-avatar');
if (avatarEl && persona.name) {
    avatarEl.textContent      = persona.name[0].toUpperCase();
    avatarEl.style.background = persona.color || '#e50914';
    avatarEl.title            = persona.name;
}

/* ── Navbar scroll ── */
window.addEventListener("scroll", () => {
    const nav = document.getElementById("mainNav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
});

/* ── Hero state ── */
let heroItems = [];
let heroIndex  = 0;
let heroTimer  = null;

function setHero(item) {
    document.getElementById("hero").style.backgroundImage = `url(${item.img})`;
    document.getElementById("hero-title").textContent = item.title;
    document.getElementById("hero-meta").textContent  = `${item.year} • ${item.genre} • ${item.type}`;
    updateDots();
}

function nextHero() {
    heroIndex = (heroIndex + 1) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

function prevHero() {
    heroIndex = (heroIndex - 1 + heroItems.length) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

function goToHero(index) {
    heroIndex = index;
    setHero(heroItems[heroIndex]);
}

function renderDots() {
    const dots = document.getElementById("hero-dots");
    dots.innerHTML = "";
    heroItems.forEach((_, i) => {
        dots.innerHTML += `<div class="dot" onclick="goToHero(${i})"></div>`;
    });
    updateDots();
}

function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === heroIndex);
    });
}

window.nextHero  = nextHero;
window.prevHero  = prevHero;
window.goToHero  = goToHero;

/* ── Fetch catalog from server ── */
async function loadCatalog() {
    const res = await fetch('/api/catalog', { headers: { 'x-auth-token': TOKEN } });

    if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
        return;
    }

    const catalog = await res.json();

    heroItems = catalog.filter(i => i.row === "trending" || i.type === "Movie");
    setHero(heroItems[0]);
    renderDots();

    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(nextHero, 5000);

    renderRow("row-trending", catalog.filter(i => i.row === "trending" && !i.isAd));
    renderRow("row-reality",  catalog.filter(i => i.row === "reality"));
    renderRow("row-continue", catalog.filter(i => i.row === "continue"));

    window._catalog = catalog;
}

/* ── Render row ── */
function renderRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    items.forEach(item => {
        let progressBar = "";
        let badgeHTML   = "";

        if (item.badge) badgeHTML = `<div class="content-badge">${item.badge}</div>`;

        if (item.row === "continue") {
            progressBar = `
                <div class="progress-bar">
                    <div class="progress" style="width:${item.progress}%"></div>
                </div>`;
        }

        container.innerHTML += `
            <div class="post">
                ${badgeHTML}
                <img class="post-thumb" src="${item.img}" alt="${item.title}">
                ${progressBar}
                <div class="post-overlay">
                    <div class="overlay-title">${item.title}</div>
                    <div class="overlay-meta">
                        <span class="match">97% Match</span>
                        <span>${item.year}</span>
                        <span>${item.type}</span>
                    </div>
                    <div class="overlay-actions">
                        <button class="like-btn" onclick="addLike(${item.id}, this)">♥</button>
                        <span class="like-count" id="likes-${item.id}">${item.likes}</span>
                        <span class="genre-tag">${item.genre}</span>
                    </div>
                </div>
            </div>`;
    });
}

/* ── Like — call server ── */
async function addLike(id, button) {
    const res  = await fetch(`/api/catalog/${id}/like`, {
        method: 'POST',
        headers: { 'x-auth-token': TOKEN }
    });
    const data = await res.json();
    if (data.success) {
        document.getElementById(`likes-${id}`).innerText = data.likes;
        button.classList.toggle("liked");
        button.classList.add("animate-heart");
        setTimeout(() => button.classList.remove("animate-heart"), 300);

        const item = (window._catalog || []).find(m => m.id === id);
        if (item) item.likes = data.likes;
    }
}

/* ── Search / Sort ── */
function filterMovies() {
    const term    = document.getElementById("searchInput").value.toLowerCase();
    const catalog = window._catalog || [];
    const filtered = catalog.filter(i => i.title.toLowerCase().includes(term));
    renderRow("row-trending", filtered.filter(i => i.row === "trending"));
    renderRow("row-reality",  filtered.filter(i => i.row === "reality"));
    renderRow("row-continue", filtered.filter(i => i.row === "continue"));
}

function sortAlphabetically() {
    const catalog = [...(window._catalog || [])];
    catalog.sort((a, b) => a.title.localeCompare(b.title));
    renderRow("row-trending", catalog.filter(i => i.row === "trending"));
    renderRow("row-reality",  catalog.filter(i => i.row === "reality"));
    renderRow("row-continue", catalog.filter(i => i.row === "continue"));
}

/* ── Scroll row ── */
function scrollRow(id, value) {
    document.getElementById(id).scrollBy({ left: value, behavior: "smooth" });
}

/* ── Logout from feed ── */
async function doLogout() {
    await fetch('/logout', { method: 'POST', headers: { 'x-auth-token': TOKEN } });
    localStorage.removeItem('token');
    sessionStorage.removeItem('persona');
    window.location.href = '/';
}

/* ── Init ── */
document.addEventListener("DOMContentLoaded", () => {
    const welcomeEl = document.getElementById('welcome-msg');
    if (welcomeEl && persona.name) {
        welcomeEl.textContent = `Welcome back, ${persona.name}!`;
    }
    loadCatalog();
});