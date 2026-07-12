// ============================================
// בדיקת הרשאה - חובה לפני כל דבר אחר בדף
// אם אין טוקן שמור - מפנה מיד ל-login ועוצר את טעינת הדף
// ============================================
if (!requireAuth()) {
    throw new Error("המשתמש לא מחובר - מופנה ל-login");
}

let heroIndex = 0;
let heroItems = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadFeed();
    setInterval(nextHero, 5000);
});

async function loadFeed() {
    try {
        const [popular, realityShows, continueWatching] = await Promise.all([
            authFetch('/api/feed/popular').then(r => r.json()),
            authFetch('/api/feed/category?category=Reality').then(r => r.json()),
            authFetch('/api/watchhistory').then(r => r.json())
        ]);

        heroItems = popular;
        if (heroItems.length > 0) { setHero(heroItems[0]); renderDots(); }

        const continueItems = continueWatching.map(record => ({
            ...record.content,
            progress: record.progress
        }));

        renderRow("row-trending", popular);
        renderRow("row-reality", realityShows);
        renderRow("row-continue", continueItems);

    } catch (error) {
        console.error('שגיאה בטעינת הפיד', error);
    }
}

function renderRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    if (!items || items.length === 0) {
        container.innerHTML = `<p style="color:#777; padding:10px;">אין תוכן להצגה כרגע</p>`;
        return;
    }

    items.forEach(item => {
        let progressBar = item.progress
            ? `<div class="progress-bar"><div class="progress" style="width:${item.progress}%"></div></div>`
            : "";

        container.innerHTML += `
            <div class="post">
                <img class="post-thumb" src="${item.img || item.videoUrl || ''}" alt="${item.title}">
                ${progressBar}
                <div class="post-overlay">
                    <div class="overlay-title">${item.title}</div>
                    <div class="overlay-meta">
                        <span>${item.year || ''}</span> • <span>${item.category || ''}</span>
                    </div>
                    <div class="overlay-actions">
                        <button class="like-btn" onclick="addLike('${item._id}', this)">♥️</button>
                        <span class="like-count" id="likes-${item._id}">${item.likes || 0}</span>
                    </div>
                </div>
            </div>`;
    });
}

function filterMovies() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll('.post').forEach(post => {
        const title = post.querySelector('.overlay-title').textContent.toLowerCase();
        post.style.display = title.includes(term) ? '' : 'none';
    });
}

// ============================================
// חיפוש לפי קטגוריה - סוג חיפוש שני כנדרש בסעיף 10
// ============================================
async function searchByCategory() {
    const category = document.getElementById("categorySelect").value;
    const resultsSection = document.getElementById("category-results-section");

    if (!category) {
        resultsSection.style.display = "none";
        return;
    }

    try {
        const response = await authFetch(`/api/content/search?category=${encodeURIComponent(category)}`);
        if (!response) return;

        const results = await response.json();

        resultsSection.style.display = "block";
        renderRow("row-category", results);

        resultsSection.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error('שגיאה בחיפוש לפי קטגוריה', error);
    }
}

function setHero(item) {
    document.getElementById("hero").style.backgroundImage = `url(${item.img || item.videoUrl || ''})`;
    document.getElementById("hero-title").textContent = item.title;
    document.getElementById("hero-meta").innerHTML = `<span>${item.year || ''}</span> | <span>${item.category || ''}</span>`;
    updateDots();
}

function nextHero() {
    if (heroItems.length === 0) return;
    heroIndex = (heroIndex + 1) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

function prevHero() {
    if (heroItems.length === 0) return;
    heroIndex = (heroIndex - 1 + heroItems.length) % heroItems.length;
    setHero(heroItems[heroIndex]);
}

function goToHero(index) {
    heroIndex = index;
    setHero(heroItems[heroIndex]);
}

function scrollRow(id, amount) {
    document.getElementById(id).scrollBy({ left: amount, behavior: 'smooth' });
}

function renderDots() {
    const dots = document.getElementById("hero-dots");
    if (!dots) return;
    dots.innerHTML = "";
    heroItems.forEach((_, index) => {
        dots.innerHTML += `<div class="dot" onclick="goToHero(${index})"></div>`;
    });
    updateDots();
}

function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === heroIndex);
    });
}

async function addLike(id, button) {
    try {
        const response = await authFetch(`/api/content/${id}/like`, { method: 'PUT' });
        if (!response) return;
        const updated = await response.json();

        document.getElementById(`likes-${id}`).innerText = updated.likes;

        button.classList.add("animate-heart");
        setTimeout(() => button.classList.remove("animate-heart"), 300);
    } catch (error) {
        console.error('שגיאה בעדכון לייק', error);
    }
}

// חשיפת פונקציות שנקראות מה-HTML (onclick) לחלון הגלובלי
window.nextHero = nextHero;
window.prevHero = prevHero;
window.goToHero = goToHero;
window.addLike = addLike;
window.searchByCategory = searchByCategory;