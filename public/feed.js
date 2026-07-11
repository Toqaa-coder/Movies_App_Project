let heroIndex = 0;
let heroItems = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadFeed();
});

async function loadFeed() {
    try {
        const [popular, continueWatching, recommendations] = await Promise.all([
            authFetch('/api/feed/popular').then(r => r.json()),
            authFetch('/api/feed/continue-watching').then(r => r.json()),
            authFetch('/api/feed/recommendations').then(r => r.json())
        ]);

        // Hero - מהתכנים הפופולריים
        heroItems = popular;
        if (heroItems.length > 0) setHero(heroItems[0]);

        // Continue Watching - כל רשומה מכילה content מקונן
        const continueItems = continueWatching.map(record => ({
            ...record.content,
            progress: record.progress
        }));

        renderRow("row-trending", popular);
        renderRow("row-reality", recommendations);
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
                    <div class="overlay-meta"><span>${item.year || ''}</span> • <span>${item.category || ''}</span></div>
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

function setHero(item) {
    document.getElementById("hero").style.backgroundImage = `url(${item.img || item.videoUrl || ''})`;
    document.getElementById("hero-title").textContent = item.title;
    document.getElementById("hero-meta").innerHTML = `<span>${item.year || ''}</span> | <span>${item.category || ''}</span>`;
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

function scrollRow(id, amount) {
    document.getElementById(id).scrollBy({ left: amount, behavior: 'smooth' });
}

